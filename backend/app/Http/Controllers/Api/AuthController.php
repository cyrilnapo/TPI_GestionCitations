<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        if (Auth::guard('web')->check()) {
            return $this->jsonResponse('Already authenticated', 409);
        }

        $validated = $request->validated();

        $user = User::query()->create([
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role' => 'user',
        ]);

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return $this->jsonResponse('Registration successful', 201, [
            'user' => $this->cleanUserPayload($user),
        ]);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (Auth::guard('web')->check()) {
            $user = $request->user();

            return $this->jsonResponse('Already authenticated', 200, [
                'user' => $this->cleanUserPayload($user),
            ]);
        }

        if (!Auth::guard('web')->attempt($request->validated())) {
            return $this->jsonResponse('Invalid credentials', 401);
        }

        $request->session()->regenerate();
        $user = $request->user();

        return $this->jsonResponse('Login successful', 200, [
            'user' => $this->cleanUserPayload($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->jsonResponse('Logout successful');
    }

    private function cleanUserPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'role' => $user->role,
        ];
    }
}
