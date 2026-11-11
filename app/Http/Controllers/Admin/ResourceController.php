<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Support\AdminResources;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    public function index(string $resource): Response
    {
        $definition = $this->definition($resource);
        $query = $definition['model']::query()->orderBy(...$definition['order']);

        if ($this->hasGallery($definition)) {
            $query->with('images');
        }

        return Inertia::render('Admin/Resource/Index', [
            'resourceKey' => $resource,
            'resource' => collect($definition)->except('model')->all(),
            'items' => $query->get(),
        ]);
    }

    public function store(Request $request, string $resource): RedirectResponse
    {
        $definition = $this->definition($resource);
        $validated = $request->validate(AdminResources::rules($definition));

        $model = new $definition['model'];
        $this->fillModel($model, $definition, $validated, $request, $resource);
        $model->save();
        $this->syncGallery($model, $definition, $request, $resource);

        ActivityLog::record("Création ({$definition['singular']})", $model->{$definition['title']});

        return back()->with('success', ucfirst($definition['singular']).' créé(e).');
    }

    public function update(Request $request, string $resource, int $id): RedirectResponse
    {
        $definition = $this->definition($resource);
        $model = $definition['model']::query()->findOrFail($id);
        $validated = $request->validate(AdminResources::rules($definition, $model->getKey()));

        $this->fillModel($model, $definition, $validated, $request, $resource);
        $model->save();
        $this->syncGallery($model, $definition, $request, $resource);

        ActivityLog::record("Modification ({$definition['singular']})", $model->{$definition['title']});

        return back()->with('success', 'Modifications enregistrées.');
    }

    public function destroy(string $resource, int $id): RedirectResponse
    {
        $definition = $this->definition($resource);
        $model = $definition['model']::query()->findOrFail($id);

        foreach ($definition['fields'] as $field) {
            if ($field['type'] === 'image' && $model->{$field['name']}) {
                Storage::disk('public')->delete($model->{$field['name']});
            }

            if ($field['type'] === 'gallery') {
                $model->images->each(fn (Model $image) => Storage::disk('public')->delete($image->path));
            }
        }

        $title = $model->{$definition['title']};
        $model->delete();

        ActivityLog::record("Suppression ({$definition['singular']})", $title);

        return back()->with('success', 'Élément supprimé.');
    }

    /**
     * @return array<string, mixed>
     */
    private function definition(string $resource): array
    {
        $definition = AdminResources::find($resource);
        abort_if($definition === null, 404);

        return $definition;
    }

    /**
     * @param  array<string, mixed>  $definition
     */
    private function hasGallery(array $definition): bool
    {
        return collect($definition['fields'])->contains('type', 'gallery');
    }

    /**
     * @param  array<string, mixed>  $definition
     * @param  array<string, mixed>  $validated
     */
    private function fillModel(Model $model, array $definition, array $validated, Request $request, string $resource): void
    {
        foreach ($definition['fields'] as $field) {
            $name = $field['name'];

            switch ($field['type']) {
                case 'gallery':
                    break;

                case 'image':
                    $file = $request->file($name);
                    if ($file instanceof UploadedFile) {
                        $this->deleteFile($model->{$name});
                        $model->{$name} = $file->store("uploads/{$resource}", 'public');
                    } elseif ($request->boolean('remove_'.$name)) {
                        $this->deleteFile($model->{$name});
                        $model->{$name} = null;
                    }
                    break;

                case 'checkbox':
                    $model->{$name} = (bool) ($validated[$name] ?? false);
                    break;

                case 'tags':
                case 'lines':
                    $items = array_values(array_filter(array_map(fn (?string $entry): string => trim((string) $entry), $validated[$name] ?? []), 'strlen'));
                    $model->{$name} = $items ?: null;
                    break;

                case 'number':
                    $model->{$name} = $validated[$name] ?? ($field['default'] ?? 0);
                    break;

                default:
                    $model->{$name} = $validated[$name] ?? null;
            }
        }

        if (isset($definition['slugFrom']) && blank($model->slug)) {
            $model->slug = $this->uniqueSlug($model, (string) $model->{$definition['slugFrom']});
        }

        if ($resource === 'blogs' && $model->status === 'published' && $model->published_at === null) {
            $model->published_at = now();
        }
    }

    /**
     * @param  array<string, mixed>  $definition
     */
    private function syncGallery(Model $model, array $definition, Request $request, string $resource): void
    {
        if (! $this->hasGallery($definition)) {
            return;
        }

        $removeIds = array_map('intval', (array) $request->input('remove_images', []));
        $model->images()->whereIn('id', $removeIds)->get()->each(function (Model $image): void {
            $this->deleteFile($image->path);
            $image->delete();
        });

        $position = (int) $model->images()->max('sort_order');
        foreach ((array) $request->file('images', []) as $file) {
            if ($file instanceof UploadedFile) {
                $model->images()->create([
                    'path' => $file->store("uploads/{$resource}/gallery", 'public'),
                    'sort_order' => ++$position,
                ]);
            }
        }
    }

    private function uniqueSlug(Model $model, string $source): string
    {
        $base = Str::slug($source) ?: Str::lower(Str::random(8));
        $slug = $base;
        $suffix = 2;

        while ($model->newQuery()->where('slug', $slug)->whereKeyNot($model->getKey())->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    private function deleteFile(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }
}
