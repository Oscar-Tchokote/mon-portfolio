<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Setting;
use App\Support\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(): Response
    {
        $values = SiteSettings::values();

        return Inertia::render('Admin/Settings', [
            'groups' => SiteSettings::groups(),
            'values' => $values,
            'files' => [
                'photo' => $values['photo'] ? Storage::url($values['photo']) : null,
                'cv_pdf' => $values['cv_pdf'] ? route('cv.show') : null,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $rules = [];
        foreach (SiteSettings::fields() as $field) {
            $rules[$field['name']] = match ($field['type']) {
                'checkbox' => ['boolean'],
                'image' => ['nullable', 'image', 'max:4096'],
                'file' => ['nullable', 'file', 'mimes:pdf', 'max:8192'],
                'markdown' => ['nullable', 'string', 'max:20000'],
                'textarea' => ['nullable', 'string', 'max:2000'],
                default => ['nullable', 'string', 'max:255'],
            };
            if (in_array($field['type'], ['image', 'file'], true)) {
                $rules['remove_'.$field['name']] = ['nullable', 'boolean'];
            }
        }
        $rules['email'][] = 'email';
        $rules['whatsapp'][] = 'regex:/^\d{8,15}$/';
        foreach (['github', 'linkedin', 'twitter'] as $urlField) {
            $rules[$urlField][] = 'url';
        }

        $validated = $request->validate($rules);
        $current = SiteSettings::values();
        $toSave = [];

        foreach (SiteSettings::fields() as $field) {
            $name = $field['name'];

            if (in_array($field['type'], ['image', 'file'], true)) {
                $file = $request->file($name);
                $disk = $field['type'] === 'file' ? 'local' : 'public';

                if ($file instanceof UploadedFile) {
                    if ($current[$name]) {
                        Storage::disk($disk)->delete($current[$name]);
                    }
                    $toSave[$name] = $file->store('profile', $disk);
                } elseif ($request->boolean('remove_'.$name) && $current[$name]) {
                    Storage::disk($disk)->delete($current[$name]);
                    $toSave[$name] = null;
                }

                continue;
            }

            $toSave[$name] = $field['type'] === 'checkbox'
                ? (bool) ($validated[$name] ?? false)
                : ($validated[$name] ?? '');
        }

        Setting::putMany($toSave);
        ActivityLog::record('Mise à jour du profil & site');

        return back()->with('success', 'Profil mis à jour.');
    }
}
