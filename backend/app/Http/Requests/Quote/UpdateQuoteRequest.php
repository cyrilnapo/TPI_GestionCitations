<?php

namespace App\Http\Requests\Quote;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'text' => ['sometimes', 'required', 'string'],
            'character_name' => ['sometimes', 'required', 'string', 'max:255'],
            'actor_name' => ['sometimes', 'required', 'string', 'max:255'],
            'movie_id' => ['sometimes', 'required', 'integer', 'exists:movies,id'],
            'user_id' => ['prohibited'],
        ];
    }
}
