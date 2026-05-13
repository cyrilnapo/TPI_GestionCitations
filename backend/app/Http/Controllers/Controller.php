<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class Controller
{
    protected function jsonResponse(string $message, int $status = 200, array $data = []): JsonResponse
    {
        return response()->json([
            'message' => $message,
            ...$data, // todo: à voir c'est quoi plus propre entre $data et ...$data
        ], $status);
    }
}
