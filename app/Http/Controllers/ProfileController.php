<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
{
    $user = $request->user();

    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => [
            'required',
            'email',
            'max:255',
            Rule::unique('users')->ignore($user->id),
        ],
        'city' => ['nullable', 'string', 'max:255'],
        'phone' => ['nullable', 'string', 'max:20'],
    ]);

    if ($validated['email'] !== $user->email &&
        $user instanceof MustVerifyEmail) {
        $this->updateVerifiedUser($user, $validated);
    } else {
        $user->fill($validated);
        $user->save();
    }

    return Redirect::route('profile.edit')->with('status', 'profile-updated');
}

protected function updateVerifiedUser($user, array $validated): void
{
    $user->forceFill([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'email_verified_at' => null,
        'city' => $validated['city'] ?? null,
        'phone' => $validated['phone'] ?? null,
    ])->save();

    $user->sendEmailVerificationNotification();
}

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
