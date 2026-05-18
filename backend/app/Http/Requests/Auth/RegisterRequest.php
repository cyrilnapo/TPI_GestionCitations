<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['prohibited'],
        ];
    }
}
