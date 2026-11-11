<?php

use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;

Artisan::command('portfolio:admin {email} {--name=Administrateur} {--password=}', function (string $email) {
    $password = $this->option('password') ?: Str::password(16, symbols: false);

    $user = User::query()->firstOrNew(['email' => $email]);
    $user->name = $user->name ?: $this->option('name');
    $user->password = $password;
    $user->forceFill(['is_admin' => true, 'email_verified_at' => $user->email_verified_at ?? now()])->save();

    $this->info("Admin prêt : {$email}");
    if (! $this->option('password')) {
        $this->warn("Mot de passe : {$password}");
    }
})->purpose('Créer un compte admin ou réinitialiser son mot de passe');
