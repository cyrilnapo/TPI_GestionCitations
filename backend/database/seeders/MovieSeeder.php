<?php

namespace Database\Seeders;

use App\Models\Movie;
use Illuminate\Database\Seeder;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Movie::create([
            'title_fr' => 'Le Parrain',
            'title_en' => 'The Godfather',
            'release_date' => '1972-03-24',
            'image_path' => 'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_.jpg',
            'user_id' => 1,
        ]);

        Movie::create([
            'title_fr' => 'Scarface',
            'title_en' => 'Scarface',
            'release_date' => '1983-12-09',
            'image_path' => 'https://upload.wikimedia.org/wikipedia/en/7/71/Scarface_-_1983_film.jpg',
            'user_id' => 2,
        ]);

        Movie::create([
            'title_fr' => 'Heat',
            'title_en' => 'Heat',
            'release_date' => '1995-12-15',
            'image_path' => 'https://upload.wikimedia.org/wikipedia/en/6/6c/Heatposter.jpg',
            'user_id' => 1,
        ]);
    }
}
