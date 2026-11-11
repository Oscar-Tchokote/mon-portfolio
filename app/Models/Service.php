<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title_fr', 'title_en', 'description_fr', 'description_en', 'icon', 'features', 'sort_order', 'is_active'])]
class Service extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['features' => 'array', 'is_active' => 'boolean'];
    }
}
