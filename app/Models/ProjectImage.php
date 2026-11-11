<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[Fillable(['project_id', 'path', 'sort_order'])]
class ProjectImage extends Model
{
    /** @var list<string> */
    protected $appends = ['url'];

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    protected function url(): Attribute
    {
        return Attribute::get(fn (): string => Storage::url($this->path));
    }
}
