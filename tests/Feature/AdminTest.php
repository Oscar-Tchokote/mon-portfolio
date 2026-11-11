<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\Blog;
use App\Models\BlogComment;
use App\Models\Contact;
use App\Models\Project;
use App\Models\User;
use App\Support\SiteSettings;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_and_non_admins_are_forbidden(): void
    {
        $this->get('/admin')->assertRedirect('/login');

        $this->actingAs(User::factory()->create())->get('/admin')->assertForbidden();
        $this->actingAs(User::factory()->create())->get('/admin/contenu/projects')->assertForbidden();
    }

    public function test_public_registration_is_disabled(): void
    {
        $this->get('/register')->assertNotFound();
    }

    public function test_admin_pages_render(): void
    {
        $admin = User::factory()->admin()->create();

        foreach (['/admin', '/admin/messages', '/admin/commentaires', '/admin/journal', '/admin/profil-site', '/admin/compte'] as $url) {
            $this->actingAs($admin)->get($url)->assertOk();
        }
        foreach (['projects', 'blogs', 'services', 'packs', 'estimator', 'experiences', 'skills'] as $resource) {
            $this->actingAs($admin)->get("/admin/contenu/{$resource}")->assertOk();
        }
        $this->actingAs($admin)->get('/admin/contenu/users')->assertNotFound();
    }

    public function test_admin_can_create_a_project_with_generated_unique_slug_and_images(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();
        Project::factory()->create(['slug' => 'app-de-livraison']);

        $this->actingAs($admin)->post('/admin/contenu/projects', [
            'title' => 'App de livraison',
            'category' => 'mobile',
            'summary_fr' => 'Livraison à Douala.',
            'technologies' => ['Flutter', ' Laravel ', ''],
            'is_featured' => '1',
            'is_published' => '1',
            'cover_image' => UploadedFile::fake()->image('cover.png'),
            'images' => [UploadedFile::fake()->image('a.png'), UploadedFile::fake()->image('b.png')],
        ])->assertSessionHasNoErrors()->assertRedirect();

        $project = Project::query()->where('title', 'App de livraison')->sole();
        $this->assertSame('app-de-livraison-2', $project->slug);
        $this->assertSame(['Flutter', 'Laravel'], $project->technologies);
        $this->assertTrue($project->is_featured);
        Storage::disk('public')->assertExists($project->cover_image);
        $this->assertCount(2, $project->images);
        $this->assertSame(1, ActivityLog::query()->count());
    }

    public function test_admin_update_can_remove_cover_and_gallery_images(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();
        $cover = UploadedFile::fake()->image('cover.png')->store('uploads/projects', 'public');
        $project = Project::factory()->create(['cover_image' => $cover]);
        $image = $project->images()->create(['path' => UploadedFile::fake()->image('g.png')->store('uploads/projects/gallery', 'public')]);

        $this->actingAs($admin)->post("/admin/contenu/projects/{$project->id}", [
            'title' => $project->title,
            'slug' => $project->slug,
            'category' => 'web',
            'summary_fr' => 'Résumé',
            'remove_cover_image' => '1',
            'remove_images' => [$image->id],
        ])->assertSessionHasNoErrors();

        $project->refresh();
        $this->assertNull($project->cover_image);
        $this->assertFalse($project->is_published);
        $this->assertCount(0, $project->images);
        Storage::disk('public')->assertMissing($cover);
        Storage::disk('public')->assertMissing($image->path);
    }

    public function test_resource_validation_rejects_invalid_values(): void
    {
        $admin = User::factory()->admin()->create();
        $existing = Project::factory()->create();

        $this->actingAs($admin)->post('/admin/contenu/projects', [
            'title' => '',
            'slug' => $existing->slug,
            'category' => 'invalid',
            'github_url' => 'not a url',
        ])->assertSessionHasErrors(['title', 'slug', 'category', 'summary_fr', 'github_url']);
    }

    public function test_publishing_a_post_without_date_sets_it_to_now(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/admin/contenu/blogs', [
            'title' => 'Mobile money et e-commerce',
            'lang' => 'fr',
            'status' => 'published',
        ])->assertSessionHasNoErrors();

        $post = Blog::query()->sole();
        $this->assertSame('mobile-money-et-e-commerce', $post->slug);
        $this->assertNotNull($post->published_at);
    }

    public function test_admin_can_delete_a_resource(): void
    {
        $admin = User::factory()->admin()->create();
        $project = Project::factory()->create();

        $this->actingAs($admin)->delete("/admin/contenu/projects/{$project->id}")->assertRedirect();

        $this->assertModelMissing($project);
    }

    public function test_admin_can_update_site_settings_and_upload_cv(): void
    {
        Storage::fake('local');
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/admin/profil-site', [
            'name' => 'Jeanne Mbarga',
            'email' => 'jeanne@example.com',
            'whatsapp' => '237690000000',
            'is_available' => '0',
            'show_blog' => '1',
            'cv_pdf' => UploadedFile::fake()->create('cv.pdf', 200, 'application/pdf'),
        ])->assertSessionHasNoErrors();

        $values = SiteSettings::values();
        $this->assertSame('Jeanne Mbarga', $values['name']);
        $this->assertFalse($values['is_available']);
        Storage::disk('local')->assertExists($values['cv_pdf']);
    }

    public function test_settings_reject_invalid_whatsapp_number(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/admin/profil-site', ['whatsapp' => '+237 690'])
            ->assertSessionHasErrors('whatsapp');
    }

    public function test_admin_can_read_and_delete_messages(): void
    {
        Storage::fake('local');
        $admin = User::factory()->admin()->create();
        $path = UploadedFile::fake()->create('brief.pdf', 10)->store('contact-attachments', 'local');
        $message = Contact::query()->create([
            'name' => 'Client', 'email' => 'c@example.com', 'message' => 'Bonjour à vous', 'attachment' => $path, 'attachment_name' => 'brief.pdf',
        ]);

        $this->actingAs($admin)->patch("/admin/messages/{$message->id}/lu")
            ->assertSessionHas('success', 'Message marqué comme lu.');
        $this->assertNotNull($message->fresh()->read_at);

        $this->actingAs($admin)->patch("/admin/messages/{$message->id}/lu")
            ->assertSessionHas('success', 'Message marqué comme non lu.');
        $this->assertNull($message->fresh()->read_at);

        $this->actingAs($admin)->get("/admin/messages/{$message->id}/piece-jointe")->assertDownload('brief.pdf');

        $this->actingAs($admin)->delete("/admin/messages/{$message->id}");
        $this->assertModelMissing($message);
        Storage::disk('local')->assertMissing($path);
    }

    public function test_toggling_a_comment_flashes_its_new_state(): void
    {
        $admin = User::factory()->admin()->create();
        $comment = BlogComment::query()->create([
            'blog_id' => Blog::factory()->create()->id,
            'name' => 'Paul',
            'content' => 'Très bon article !',
        ]);

        $this->actingAs($admin)->patch("/admin/commentaires/{$comment->id}")
            ->assertSessionHas('success', 'Commentaire approuvé et publié.');
        $this->assertTrue($comment->fresh()->is_approved);

        $this->actingAs($admin)->patch("/admin/commentaires/{$comment->id}")
            ->assertSessionHas('success', 'Commentaire masqué.');
        $this->assertFalse($comment->fresh()->is_approved);
    }

    public function test_admin_visits_are_not_tracked(): void
    {
        $this->actingAs(User::factory()->admin()->create())->get('/');

        $this->assertDatabaseCount('page_views', 0);
    }
}
