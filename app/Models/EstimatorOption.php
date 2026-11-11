<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['group', 'label_fr', 'label_en', 'price', 'sort_order', 'is_active'])]
class EstimatorOption extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['price' => 'integer', 'is_active' => 'boolean'];
    }
}
