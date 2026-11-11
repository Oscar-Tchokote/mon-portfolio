<?php

namespace App\Models;

use Database\Factories\BlogFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

#[Fillable(['title', 'slug', 'lang', 'excerpt', 'content', 'cover_image', 'tags', 'status', 'published_at'])]
class Blog extends Model
{
    /** @use HasFactory<BlogFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $appends = ['cover_url', 'reading_minutes'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<BlogComment, $this>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(BlogComment::class);
    }

    /**
     * @param  Builder<Blog>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published')
            ->where(fn (Builder $q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))
            ->orderByDesc('published_at');
    }

    protected function coverUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->cover_image ? Storage::url($this->cover_image) : null);
    }

    protected function readingMinutes(): Attribute
    {
        return Attribute::get(fn (): int => max(1, (int) ceil(str_word_count(strip_tags((string) $this->content)) / 200)));
    }
}
