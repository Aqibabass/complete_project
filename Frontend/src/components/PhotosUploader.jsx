import { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import axios from "axios";
import ErrorMessage from "../components/ErrorMessage";

function PhotosUploader({ addedPhotos, onChange }) {
    const [loading, setLoading] = useState(false);
    const [photoLink, setPhotoLink] = useState("");
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
        setPhotoLink("");
    };

    const addPhotoByLink = async (ev) => {
        ev.preventDefault();
        if (!photoLink.trim()) return;

        try {
            setLoading(true);
            const { data } = await axios.post("/upload-by-link", { link: photoLink });
            onChange((prev) => [...prev, data.url]); // Add the Cloudinary URL to the list
            setPhotoLink("");
        } catch (error) {
            console.error("Error adding photo by link:", error);
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    // ----------------------- Upload photo from device -----------------------
    const uploadImage = async (e) => {
        const files = e.target.files;
        if (files.length === 0) return;

        setLoading(true);
        try {
            const data = new FormData();
            for (let i = 0; i < files.length; i++) {
                data.append("photos", files[i]); // Append files to FormData
            }

            const { data: urls } = await axios.post("/upload", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onChange((prev) => [...prev, ...urls]); // Add Cloudinary URLs to the list
        } catch (error) {
            console.error("Upload failed:", error);
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    // ----------------------- Delete a photo -----------------------
    const handleDeletePic = (ev, photoUrl) => {
        ev.preventDefault();
        onChange(addedPhotos.filter((url) => url !== photoUrl)); // Remove the URL from the list
    };

    const frontPic = (ev, photoUrl) => {
        ev.preventDefault();
        const updatedPhotos = [photoUrl, ...addedPhotos.filter((url) => url !== photoUrl)]; // Move the selected photo to the front
        onChange(updatedPhotos);
    };

    return (
        <>
            
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Add using a link ...jpg"
                    value={photoLink}
                    onChange={(ev) => setPhotoLink(ev.target.value)}
                />
                <button
                    onClick={addPhotoByLink}
                    className="bg-blue-400 px-4 rounded-2xl hover:bg-primary"
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Add\u00A0picture"}
                </button>
            </div>

            <div className="grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mt-3">
                {addedPhotos.map((url, index) => (
                    <div key={index} className="h-32 flex relative">
                       
                        <img
                            className="rounded-2xl w-full object-cover"
                            src={url}
                            alt={`Photo ${index + 1}`}
                            onError={(e) => {
                                e.target.src = "/hotel.png";
                            }}
                        />
                        
                        <button
                            onClick={(ev) => handleDeletePic(ev, url)}
                            className="cursor-pointer absolute bottom-1 right-2 p-1 text-white hover:text-red-600 rounded-full bg-black bg-opacity-50"
                        >
                            <FaTrashAlt />
                        </button>
                        
                        <button
                            onClick={(ev) => frontPic(ev, url)}
                            className="cursor-pointer absolute bottom-1 left-2 p-1 text-white hover:text-primary rounded-full bg-black bg-opacity-50"
                        >
                            {url === addedPhotos[0] ? (
                                <IoIosStar className="text-primary" />
                            ) : (
                                <IoIosStar />
                            )}
                        </button>
                    </div>
                ))}

                
                {showError && (
                    <ErrorMessage
                        message="Error uploading the photo. Please try again."
                        onClose={handleCloseError}
                    />
                )}

                
                {loading ? (
                    <label className="h-32 cursor-pointer flex flex-col items-center justify-center border bg-transparent rounded-2xl p-2 text-lg text-gray-900">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </label>
                ) : (
                    <label className="h-32 cursor-pointer flex flex-col items-center justify-center border bg-transparent rounded-2xl p-2 text-lg text-gray-900">
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={uploadImage}
                            accept="image/*" 
                        />
                        <AiOutlineCloudUpload className="w-8 h-8" />
                        <h2 className="text-center">Upload from device</h2>
                    </label>
                )}
            </div>
        </>
    );
}

export default PhotosUploader;
