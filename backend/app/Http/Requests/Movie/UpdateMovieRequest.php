<?php

namespace App\Http\Requests\Movie;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMovieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title_fr' => ['sometimes', 'required', 'string', 'max:255'],
            'title_en' => ['sometimes', 'required', 'string', 'max:255'],
            'release_date' => ['sometimes', 'required', 'date'],
            'image_path' => ['sometimes', 'nullable', 'url', 'max:2048'],
            'user_id' => ['prohibited'],
        ];
    }
}
