<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->default('web');
            $table->string('summary_fr', 500)->nullable();
            $table->string('summary_en', 500)->nullable();
            $table->text('description_fr')->nullable();
            $table->text('description_en')->nullable();
            $table->json('technologies')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('github_url')->nullable();
            $table->string('demo_url')->nullable();
            $table->string('client')->nullable();
            $table->string('year', 10)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->unsignedInteger('views')->default(0);
            $table->timestamps();
        });

        Schema::create('project_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title_fr');
            $table->string('title_en')->nullable();
            $table->text('description_fr')->nullable();
            $table->text('description_en')->nullable();
            $table->string('icon')->default('code');
            $table->json('features')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('packs', function (Blueprint $table) {
            $table->id();
            $table->string('name_fr');
            $table->string('name_en')->nullable();
            $table->string('tagline_fr')->nullable();
            $table->string('tagline_en')->nullable();
            $table->unsignedBigInteger('price')->nullable();
            $table->string('price_note_fr')->nullable();
            $table->string('price_note_en')->nullable();
            $table->json('features')->nullable();
            $table->boolean('is_highlighted')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('type')->default('work');
            $table->string('title_fr');
            $table->string('title_en')->nullable();
            $table->string('organization');
            $table->string('location')->nullable();
            $table->string('period');
            $table->text('description_fr')->nullable();
            $table->text('description_en')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->default('backend');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('estimator_options', function (Blueprint $table) {
            $table->id();
            $table->string('group')->default('feature');
            $table->string('label_fr');
            $table->string('label_en')->nullable();
            $table->unsignedBigInteger('price')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('lang', 2)->default('fr');
            $table->string('excerpt', 500)->nullable();
            $table->longText('content')->nullable();
            $table->string('cover_image')->nullable();
            $table->json('tags')->nullable();
            $table->string('status')->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('views')->default(0);
            $table->unsignedInteger('likes')->default(0);
            $table->timestamps();
        });

        Schema::create('blog_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->text('content');
            $table->boolean('is_approved')->default(false);
            $table->string('ip_hash', 64)->nullable();
            $table->timestamps();
        });

        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('subject')->nullable();
            $table->string('budget')->nullable();
            $table->text('message');
            $table->string('attachment')->nullable();
            $table->string('attachment_name')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->string('path');
            $table->string('ip_hash', 64)->nullable();
            $table->string('referrer')->nullable();
            $table->string('device', 20)->nullable();
            $table->timestamp('created_at')->useCurrent()->index();
        });

        Schema::create('cv_events', function (Blueprint $table) {
            $table->id();
            $table->string('action', 20);
            $table->string('ip_hash', 64)->nullable();
            $table->timestamp('created_at')->useCurrent()->index();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->string('subject')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at')->useCurrent()->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach (['activity_logs', 'cv_events', 'page_views', 'contacts', 'blog_comments', 'blogs', 'estimator_options', 'skills', 'experiences', 'packs', 'services', 'project_images', 'projects', 'settings'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
