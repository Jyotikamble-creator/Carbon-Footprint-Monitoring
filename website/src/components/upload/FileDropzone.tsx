"use client";

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileDropzoneProps {
	onFileSelect: (file: File) => void;
}

export default function FileDropzone({ onFileSelect }: FileDropzoneProps) {
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			const file = files[0];
			// Validate file type and size
			if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
				if (file.size > 10 * 1024 * 1024) { // 10MB limit
					alert('File size exceeds 10MB limit. Please choose a smaller file.');
					return;
				}
				onFileSelect(file);
			} else {
				alert('Please upload a CSV file only. Other file types are not supported.');
			}
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			onFileSelect(files[0]);
		}
	};

	const handleChooseFile = () => {
		fileInputRef.current?.click();
	};

	return (
		<div
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			className={`relative border-2 border-dashed rounded-2xl p-16 transition-all ${
				isDragging
					? 'border-emerald-500 bg-emerald-500/10'
					: 'border-gray-600 bg-gray-800/20'
			}`}
		>
			<input
				ref={fileInputRef}
				type="file"
				accept=".csv"
				onChange={handleFileChange}
				className="hidden"
			/>

			<div className="flex flex-col items-center justify-center text-center">
				{/* Upload Icon */}
				<div className="mb-6">
					<div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
						<Upload className="w-8 h-8 text-emerald-500" />
					</div>
				</div>

				{/* Text */}
				<h3 className="text-xl font-semibold text-white mb-2">Drag & drop CSV file here</h3>
				<p className="text-gray-400 mb-1">or click to select file</p>
				<p className="text-sm text-gray-500 mb-6">Max file size: 10MB</p>

				{/* Choose File Button */}
				<button
					onClick={handleChooseFile}
					className="px-6 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
				>
					Choose File
				</button>
			</div>
		</div>
	);
}
