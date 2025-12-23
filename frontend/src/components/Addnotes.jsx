import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Loader from "./Loader";

const Addnotes = ({
  getNotes,
  setIsExpanded,
  setEdit,
  edit,
  note,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { title: "" },
  });

  const submitNote = async (data) => {
    try {
      const response = await fetch(
        `${
          edit && note
            ? `http://localhost:3000/notes/${note._id}`
            : "http://localhost:3000/notes"
        }`,
        {
          method: `${edit && note ? "PUT" : "POST"}`,
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const res = await response.json();

      if (response.ok) {
        getNotes();
        reset({ title: "", content: "" });
        setIsExpanded(false);
        setEdit(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (edit && note) {
      reset({
        title: note.title,
        content: note.content,
      });
    } else {
      reset({
        title: "",
        content: "",
      });
    }
  }, [edit, note, reset]);

  return (
    <div className="relative w-full max-w-3xl mx-auto px-3 sm:px-4">
      {/* ===== Loader Overlay (UI only) ===== */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 rounded-2xl">
          <Loader />
        </div>
      )}

      <form onSubmit={handleSubmit(submitNote)}>
        {/* ===== HEADER ===== */}
        <div className="w-full p-3 sm:p-4 rounded-t-2xl">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="fa-solid fa-xmark bg-red-800 text-black h-7 w-7 
                         flex items-center justify-center rounded-full
                         hover:bg-yellow-800"
              onClick={() => {
                setEdit(false);
                setIsExpanded(false);
                reset({ title: "", content: "" });
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="fa-solid fa-check bg-green-800 text-black h-7 w-7
                         flex items-center justify-center rounded-full
                         hover:bg-yellow-800 disabled:opacity-50"
            />
          </div>

          {/* ===== TITLE ERROR ===== */}
          {errors.title && (
            <p className="mt-2 text-red-600 text-sm">
              {errors.title.message}
            </p>
          )}

          {/* ===== TITLE INPUT ===== */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter your title"
              className="w-full outline-none p-2 sm:p-3 rounded-lg"
              {...register("title", {
                required: { value: true, message: "Title is required" },
              })}
            />
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="w-full p-3 sm:p-4 rounded-b-2xl">
          {errors.content && (
            <p className="mb-2 text-red-600 text-sm">
              {errors.content.message}
            </p>
          )}

          <textarea
            placeholder="Enter your content"
            className="w-full min-h-[120px] sm:min-h-[160px]
                       outline-none p-2 sm:p-3 rounded-lg resize-none"
            {...register("content", {
              required: { value: true, message: "content is required" },
            })}
          />
        </div>
      </form>
    </div>
  );
};

export default Addnotes;
