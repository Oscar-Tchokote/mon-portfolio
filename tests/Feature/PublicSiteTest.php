<?php

namespace Tests\Feature;

use App\Models\Blog;
use App\Models\BlogComment;
use App\Models\Contact;
use App\Models\CvEvent;
use App\Models\PageView;
use App\Models\Project;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicSiteTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_pages_render(): void
    {
        $project = Project::factory()->create();
        $post = Blog::factory()->create();

        foreach (['/', "/projets/{$project->slug}", '/blog', "/blog/{$post->slug}"] as $url) {
            $this->get($url)->assertOk();
        }
    }

    public function test_former_pages_redirect_to_their_landing_section(): void
    {
        foreach (['a-propos', 'services', 'contact', 'projets'] as $section) {
            $this->get("/{$section}")->assertRedirect(route('home')."#{$section}")->assertStatus(301);
        }
    }

    public function test_home_lists_every_published_project_for_the_one_page_landing(): void
    {
        Project::factory()->count(5)->create(['is_featured' => false]);
        Project::factory()->unpublished()->create();

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->has('projects', 5)
            ->has('services')
            ->has('packs')
            ->has('estimator')
            ->has('experiences')
            ->has('skillGroups'));
    }

    public function test_unpublished_project_and_draft_post_are_hidden(): void
    {
        $project = Project::factory()->unpublished()->create();
        $draft = Blog::factory()->draft()->create();
        $scheduled = Blog::factory()->create(['published_at' => now()->addWeek()]);

        $this->get("/projets/{$project->slug}")->assertNotFound();
        $this->get("/blog/{$draft->slug}")->assertNotFound();
        $this->get("/blog/{$scheduled->slug}")->assertNotFound();
    }

    public function test_project_views_are_counted_once_per_session(): void
    {
        $project = Project::factory()->create();

        $this->get("/projets/{$project->slug}");
        $this->get("/projets/{$project->slug}");

        $this->assertSame(1, $project->fresh()->views);
    }

    public function test_page_views_are_tracked_for_visitors_but_not_bots(): void
    {
        $this->get('/');
        $this->withHeader('User-Agent', 'Googlebot/2.1')->get('/');

        $this->assertSame(1, PageView::query()->count());
        $this->assertNotNull(PageView::query()->first()->ip_hash);
    }

    public function test_blog_is_hidden_when_module_is_disabled(): void
    {
        Setting::putMany(['show_blog' => false]);

        $this->get('/blog')->assertNotFound();
    }

    public function test_contact_message_is_stored_with_private_attachment(): void
    {
        Storage::fake('local');

        $this->post('/contact', [
            'name' => 'Awa Ndiaye',
            'email' => 'awa@example.com',
            'message' => 'Bonjour, je souhaite une application de livraison.',
            'attachment' => UploadedFile::fake()->create('cahier.pdf', 500, 'application/pdf'),
        ])->assertRedirect()->assertSessionHas('success', 'message_sent');

        $contact = Contact::query()->sole();
        $this->assertSame('cahier.pdf', $contact->attachment_name);
        Storage::disk('local')->assertExists($contact->attachment);
    }

    public function test_contact_validates_input_and_attachment_size(): void
    {
        $this->post('/contact', [
            'name' => '',
            'email' => 'not-an-email',
            'message' => 'court',
            'attachment' => UploadedFile::fake()->create('big.pdf', 3000, 'application/pdf'),
        ])->assertSessionHasErrors(['name', 'email', 'message', 'attachment']);

        $this->assertSame(0, Contact::query()->count());
    }

    public function test_contact_upload_above_php_post_limit_returns_a_form_error(): void
    {
        $this->from('/')
            ->call('POST', '/contact', server: ['CONTENT_LENGTH' => 20 * 1024 * 1024])
            ->assertRedirect('/')
            ->assertSessionHasErrors('attachment');

        $this->assertSame(0, Contact::query()->count());
    }

    public function test_contact_honeypot_silently_drops_spam(): void
    {
        $this->post('/contact', [
            'name' => 'Bot',
            'email' => 'bot@example.com',
            'message' => 'Buy cheap things now please',
            'website' => 'http://spam.example',
        ])->assertSessionHas('success', 'message_sent');

        $this->assertSame(0, Contact::query()->count());
    }

    public function test_comments_wait_for_approval_before_being_shown(): void
    {
        $post = Blog::factory()->create();

        $this->post("/blog/{$post->slug}/commentaires", ['name' => 'Paul', 'content' => 'Très bon article !'])
            ->assertSessionHas('success', 'comment_pending');

        $comment = BlogComment::query()->sole();
        $this->assertFalse($comment->is_approved);

        $this->get("/blog/{$post->slug}")->assertInertia(fn (Assert $page) => $page->has('comments', 0));

        $comment->update(['is_approved' => true]);
        $this->get("/blog/{$post->slug}")->assertInertia(fn (Assert $page) => $page->has('comments', 1));
    }

    public function test_a_post_can_only_be_liked_once_per_session(): void
    {
        $post = Blog::factory()->create();

        $this->post("/blog/{$post->slug}/like");
        $this->post("/blog/{$post->slug}/like");

        $this->assertSame(1, $post->fresh()->likes);
    }

    public function test_cv_returns_404_until_uploaded_then_streams_and_tracks(): void
    {
        Storage::fake('local');
        $this->get('/cv')->assertNotFound();

        Storage::disk('local')->put('profile/cv.pdf', '%PDF-1.4 test');
        Setting::putMany(['cv_pdf' => 'profile/cv.pdf']);

        $this->get('/cv')->assertOk()->assertHeader('Content-Type', 'application/pdf');
        $this->get('/cv/telecharger')->assertOk()->assertDownload();

        $this->assertEqualsCanonicalizing(['view', 'download'], CvEvent::query()->pluck('action')->all());
    }

    public function test_sitemap_lists_published_content_only(): void
    {
        $published = Project::factory()->create();
        $hidden = Project::factory()->unpublished()->create();

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertSee(route('projects.show', $published->slug), false)
            ->assertDontSee($hidden->slug, false);
    }
}
