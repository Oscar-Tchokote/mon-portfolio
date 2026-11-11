<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name_fr', 'name_en', 'tagline_fr', 'tagline_en', 'price', 'price_note_fr', 'price_note_en', 'features', 'is_highlighted', 'sort_order', 'is_active'])]
class Pack extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['features' => 'array', 'price' => 'integer', 'is_highlighted' => 'boolean', 'is_active' => 'boolean'];
    }
}
