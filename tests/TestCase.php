<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    /**
     * Refuse to run before RefreshDatabase / DatabaseMigrations wipe the database
     * unless it is the in-memory test database.
     *
     * A cached config (`php artisan optimize` / `config:cache`) makes the suite ignore
     * phpunit.xml and point at the real database, which would then be erased.
     *
     * @return array<class-string, class-string>
     */
    protected function setUpTraits()
    {
        $connection = config('database.default');
        $database = config("database.connections.{$connection}.database");

        if (! $this->app->environment('testing') || $database !== ':memory:') {
            throw new RuntimeException(
                "Tests stopped: they would erase the real database [{$connection}: {$database}]. "
                .'Run `php artisan optimize:clear` and try again.'
            );
        }

        return parent::setUpTraits();
    }
}
