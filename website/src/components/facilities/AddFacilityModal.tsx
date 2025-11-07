"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useCreateFacility } from '@/lib/facilities/hooks';
import type { CreateFacilityRequest } from '@/types/tenants/tenantstypes';

interface FormData {
	facilityName: string;
	country: string;
	region: string;
}

interface FormErrors {
	facilityName?: string;
	country?: string;
	region?: string;
}

export default function AddFacilityModal() {
	const router = useRouter();
	const createFacilityMutation = useCreateFacility();
	const [formData, setFormData] = useState<FormData>({
		facilityName: '',
		country: '',
		region: '',
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitError, setSubmitError] = useState<string | null>(null);

	const countries = [
		'USA',
		'Canada',
		'Mexico',
		'Germany',
		'France',
		'UK',
		'Singapore',
		'Japan',
		'Australia',
		'Brazil',
	];

	const regions: { [key: string]: string[] } = {
		USA: ['WECC', 'ERCOT', 'RFC', 'SERC', 'MRO', 'NPCC', 'SPP', 'FRCC'],
		Canada: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
		Germany: ['DE', 'DE-North', 'DE-South'],
		Singapore: ['SG'],
		UK: ['GB'],
		France: ['FR'],
		Mexico: ['MX'],
		Japan: ['JP'],
		Australia: ['AU'],
		Brazil: ['BR'],
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
    
		// Clear error when user starts typing
		if (errors[name as keyof FormErrors]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}

		setFormData((prev) => ({
			...prev,
			[name]: value,
			// Reset region if country changes
			...(name === 'country' ? { region: '' } : {}),
		}));
	};

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.facilityName.trim()) {
			newErrors.facilityName = 'This field is required.';
		}

		if (!formData.country) {
			newErrors.country = 'Please select a country.';
		}

		if (!formData.region) {
			newErrors.region = 'Please select a region.';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setSubmitError(null);

		const facilityData: CreateFacilityRequest = {
			name: formData.facilityName.trim(),
			country: formData.country || undefined,
			grid_region: formData.region || undefined,
		};

		console.log('Sending facility data:', facilityData);
		createFacilityMutation.mutate(facilityData, {
			onSuccess: () => {
				// Navigate back to facilities page on success
				router.push('/facilities');
			},
			onError: (err: any) => {
				console.error('Failed to create facility:', err);
				
				// Handle specific error types
				if (err.status === 422) {
					setSubmitError('Validation Error: Please check that all fields are filled correctly. The server rejected the facility data format.');
				} else if (err.status === 400) {
					setSubmitError('Bad Request: ' + (err.message || 'Invalid facility data provided.'));
				} else if (err.status === 401) {
					setSubmitError('Unauthorized: Please log in again.');
				} else if (err.status === 500) {
					setSubmitError('Server Error: There is an issue with the backend server. Please try again later.');
				} else {
					setSubmitError(err.message || 'Failed to create facility. Please try again.');
				}
			}
		});
	};

	const handleCancel = () => {
		router.push('/facilities');
	};

	const availableRegions = formData.country ? regions[formData.country] || [] : [];

	return (
	<div className="w-full max-w-2xl bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white mb-2">Add New Facility</h1>
				<p className="text-gray-400">Enter the details for the new facility below.</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Facility Name */}
				<div>
					<label htmlFor="facilityName" className="block text-white font-medium mb-2">
						Facility Name
					</label>
					<input
						type="text"
						id="facilityName"
						name="facilityName"
						value={formData.facilityName}
						onChange={handleChange}
						placeholder="e.g., North American Headquarters"
						className={`w-full px-4 py-3 bg-slate-700/50 border ${
							errors.facilityName ? 'border-red-500' : 'border-slate-600'
						} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
					/>
					{errors.facilityName && (
						<div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
							<AlertCircle className="w-4 h-4" />
							<span>{errors.facilityName}</span>
						</div>
					)}
				</div>

				{/* Country */}
				<div>
					<label htmlFor="country" className="block text-white font-medium mb-2">
						Country
					</label>
					<div className="relative">
						<select
							id="country"
							name="country"
							value={formData.country}
							onChange={handleChange}
							className={`w-full px-4 py-3 bg-slate-700/50 border ${
								errors.country ? 'border-red-500' : 'border-slate-600'
							} rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all ${
								!formData.country ? 'text-gray-500' : ''
							}`}
						>
							<option value="" disabled>
								Select a country
							</option>
							{countries.map((country) => (
								<option key={country} value={country} className="bg-slate-800">
									{country}
								</option>
							))}
						</select>
						<svg
							className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
					{errors.country && (
						<div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
							<AlertCircle className="w-4 h-4" />
							<span>{errors.country}</span>
						</div>
					)}
				</div>

				{/* Region */}
				<div>
					<label htmlFor="region" className="block text-white font-medium mb-2">
						Region
					</label>
					<div className="relative">
						<select
							id="region"
							name="region"
							value={formData.region}
							onChange={handleChange}
							disabled={!formData.country}
							className={`w-full px-4 py-3 bg-slate-700/50 border ${
								errors.region ? 'border-red-500' : 'border-slate-600'
							} rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
								!formData.region ? 'text-gray-500' : ''
							}`}
						>
							<option value="" disabled>
								Select a region
							</option>
							{availableRegions.map((region) => (
								<option key={region} value={region} className="bg-slate-800">
									{region}
								</option>
							))}
						</select>
						<svg
							className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
					{!formData.country && (
						<p className="mt-2 text-sm text-gray-500">Please select a country first.</p>
					)}
					{errors.region && (
						<div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
							<AlertCircle className="w-4 h-4" />
							<span>{errors.region}</span>
						</div>
					)}
				</div>

				{/* Submit Error */}
				{submitError && (
					<div className="flex items-center gap-2 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-400 text-sm">
						<AlertCircle className="w-4 h-4 shrink-0" />
						<span>{submitError}</span>
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex items-center justify-end gap-4 pt-6">
					<button
						type="button"
						onClick={handleCancel}
						disabled={createFacilityMutation.isPending}
						className="px-6 py-3 text-gray-300 hover:text-white border border-slate-600 rounded-lg transition-colors disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={createFacilityMutation.isPending}
						className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
						style={{ minWidth: 140 }}
					>
						{createFacilityMutation.isPending ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								Submitting...
							</>
						) : (
							'Add Facility'
						)}
					</button>
				</div>
			</form>
		</div>
	);

}
