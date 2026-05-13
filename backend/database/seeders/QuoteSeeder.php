<?php

namespace Database\Seeders;

use App\Models\Quote;
use Illuminate\Database\Seeder;

class QuoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Quote::create([
            'text' => 'I\'m gonna make him an offer he can\'t refuse.',
            'character_name' => 'Vito Corleone',
            'actor_name' => 'Marlon Brando',
            'movie_id' => 1,
            'user_id' => 1,
        ]);

        Quote::create([
            'text' => 'Say hello to my little friend!',
            'character_name' => 'Tony Montana',
            'actor_name' => 'Al Pacino',
            'movie_id' => 2,
            'user_id' => 2,
        ]);

        Quote::create([
            'text' => 'Don\'t let yourself get attached to anything you are not willing to walk out on in 30 seconds flat.',
            'character_name' => 'Neil McCauley',
            'actor_name' => 'Robert De Niro',
            'movie_id' => 3,
            'user_id' => 1,
        ]);
    }
}
