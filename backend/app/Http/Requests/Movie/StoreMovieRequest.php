<?php

namespace App\Http\Requests\Movie;

use Illuminate\Foundation\Http\FormRequest;

class StoreMovieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title_fr' => ['required', 'string', 'max:255'],
            'title_en' => ['required', 'string', 'max:255'],
            'release_date' => ['required', 'date'],
            'image_path' => ['nullable', 'url', 'max:2048'],
            'user_id' => ['prohibited'],
        ];
    }
}
