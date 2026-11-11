<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'action', 'subject', 'ip_address', 'created_at'])]
class ActivityLog extends Model
{
    public const UPDATED_AT = null;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['created_at' => 'datetime'];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Record an admin action for the activity journal.
     */
    public static function record(string $action, ?string $subject = null): void
    {
        static::query()->create([
            'user_id' => auth()->id(),
            'action' => $action,
            'subject' => $subject ? mb_substr($subject, 0, 250) : null,
            'ip_address' => request()->ip(),
        ]);
    }
}
