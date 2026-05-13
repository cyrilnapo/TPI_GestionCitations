<?php

namespace App\Http\Requests\Quote;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'text' => ['required', 'string'],
            'character_name' => ['required', 'string', 'max:255'],
            'actor_name' => ['required', 'string', 'max:255'],
            'movie_id' => ['required', 'integer', 'exists:movies,id'],
            'user_id' => ['prohibited'],
        ];
    }
}
