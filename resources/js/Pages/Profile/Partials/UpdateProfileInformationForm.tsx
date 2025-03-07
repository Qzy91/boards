import React, { useState, useEffect, FormEventHandler } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

type Props = { mustVerifyEmail: boolean; status?: string; className?: string };

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}: Props) {
    const { auth, regions, errors } = usePage<{
        auth: { user: User };
        regions: Region[];
        errors: any;
    }>().props;
    const user = auth.user;

    const userCityId = user.city_id?.toString() || "";

    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        region_id: "",
        city_id: userCityId,
    });

    useEffect(() => {
        //
        if (userCityId) {
            for (const reg of regions) {
                if (reg.cities.some((c) => c.id === Number(userCityId))) {
                    setFormData((prev) => ({
                        ...prev,
                        region_id: reg.id.toString(),
                    }));
                    break;
                }
            }
        }
    }, [userCityId, regions]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("email", formData.email);
        payload.append("phone", formData.phone ?? "");
        payload.append("city_id", formData.city_id ?? "");
        router.post(route("profile.update"), payload);
    };

    // Фильтруем города
    const filteredCities = React.useMemo(() => {
        if (!formData.region_id) return [];
        const region = regions.find((r) => r.id === Number(formData.region_id));
        return region?.cities || [];
    }, [formData.region_id, regions]);

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Name */}
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Region Select */}
                <div>
                    <InputLabel htmlFor="region" value="Region" />
                    <Select
                        value={formData.region_id}
                        onValueChange={(value) => {
                            handleChange("region_id", value);
                            handleChange("city_id", "");
                        }}
                    >
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                            {regions.map((region) => (
                                <SelectItem
                                    key={region.id}
                                    value={region.id.toString()}
                                >
                                    {region.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* City Select */}
                <div>
                    <InputLabel htmlFor="city_id" value="City" />
                    <Select
                        value={formData.city_id}
                        onValueChange={(value) =>
                            handleChange("city_id", value)
                        }
                        disabled={!formData.region_id}
                    >
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredCities.map((city) => (
                                <SelectItem
                                    key={city.id}
                                    value={city.id.toString()}
                                >
                                    {city.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError className="mt-2" message={errors.city_id} />
                </div>

                {/* Phone */}
                <div>
                    <InputLabel htmlFor="phone" value="Phone" />
                    <TextInput
                        id="phone"
                        type="tel"
                        value={formData.phone || ""}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        autoComplete="tel"
                    />
                    <InputError className="mt-2" message={errors.phone} />
                </div>

                {/* Проверка на верификацию email */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.{" "}
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton type="submit">Save</PrimaryButton>
                    <Transition
                        show={false}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
