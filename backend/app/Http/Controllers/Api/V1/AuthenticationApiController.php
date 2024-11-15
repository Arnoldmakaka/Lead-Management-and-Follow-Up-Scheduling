<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Http\Resources\UserResource;
use Exception;

class AuthenticationApiController extends Controller
{
    /**
     * Log in user using email and password
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => ['required', 'string', 'email'],
                'password' => ['required', 'string'],
            ], [
                'title.unique' => 'The :attribute exists. Enter a new :attribute',
                'required' => 'The :attribute is required. Please provide sufficient information.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'remark'    => 'validation_error',
                    'status'    => 'error',
                    'message'   => $validator->errors()->all(),
                ]);
            }

            $credentials = $request->only('email', 'password');

            $user = User::where('email', $credentials['email'])->first();

            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                return response()->json([
                    'remark' => 'authentication_error',
                    'status' => 'error',
                    'message' => "Credentials provided are incorrect. Please provide the correct details to login. Thank you",
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'remark' => 'logged in successfully',
                'status' => 'success',
                'message' => 'Logged in Successfully',
                'data' => [
                    'token_type' => 'Bearer',
                    'access_token' => $token,
                    'user' => new UserResource($user),
                ],
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'remark' => 'validation_error',
                'status' => 'error',
                'message' => $e->errors(),
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                'remark' => 'error',
                'status' => 'error',
                'message' => 'An unexpected error occurred. Please try again later.',
            ], 500);
        }
    }

    /**
     * Sign up User
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function signUp(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => ['required', 'string', 'email', 'unique:users,email'],
                'password' => ['required', 'string'],
                'role' => ['required', 'string', 'in:admin,sales_manager,sales_rep']
            ], [
                'title.unique' => 'The :attribute exists. Enter a new :attribute',
                'required' => 'The :attribute is required. Please provide sufficient information.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'remark'    => 'validation_error',
                    'status'    => 'error',
                    'message'   => $validator->errors()->all(),
                ]);
            }

            $credentials = $request->only('email', 'password', 'role');
            $user = User::create($credentials);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'remark' => 'signed up successfully',
                'status' => 'success',
                'message' => 'signed up Successfully',
                'data' => [
                    'token_type' => 'Bearer',
                    'access_token' => $token,
                    'user' => new UserResource($user),
                ],
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'remark' => 'validation_error',
                'status' => 'error',
                'message' => $e->errors(),
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                'remark' => 'error',
                'status' => 'error',
                'message' => 'An unexpected error occurred. Please try again later.',
            ], 500);
        }
    }

}
