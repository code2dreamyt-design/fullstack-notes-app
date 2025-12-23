import React, { useEffect, useRef, useState } from "react";
import Addnotes from "./Addnotes.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

const Notes = () => {
  const sectionRef = useRef(null);

  const [notes, setNotes] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [edit, setEdit] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [msg, setMsg] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [sortOpt, setSortOpt] = useState("latest");
  const [addFilter, setAddFilter] = useState(false);
  const [selected, setSelected] = useState(null);
  const [fav, setFav] = useState(false);
  const [loader, setLoader] = useState(false);
  const [url, setUrl] = useState("http://localhost:3000/notes");

  const navigate = useNavigate();

  const btns = [
    { id: 1, lable: "Latest", btnValue: "latest" },
    { id: 2, lable: "Oldest", btnValue: "oldest" },
    { id: 3, lable: "Title", btnValue: "title" },
  ];

  const scroll = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = () => {
    if (searchVal !== "") {
      setUrl(
        `http://localhost:3000/notes?search=${searchVal}&&sort=${sortOpt}&&isFav=${fav}`
      );
      setSearchVal("");
      setIsSearch(false);
      setAddFilter(false);
    } else {
      setUrl("http://localhost:3000/notes");
    }
  };

  const getNotes = async () => {
    setLoader(true);
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        setNotes(data);
      } else {
        setNotes([]);
        setMsg("You have no notes");
      }
    } catch (error) {
      setNotes([]);
      setMsg("Error fetching notes");
    } finally {
      setLoader(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        getNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFav = async (id) => {
    setLoader(true);
    try {
      await axios.patch(
        `http://localhost:3000/notes/${id}`,
        {},
        { withCredentials: true }
      );

      setNotes((prev) =>
        prev.map((note) =>
          note._id === id ? { ...note, isFav: !note.isFav } : note
        )
      );
    } catch (error) {
      console.log(error.response?.data?.msg);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, [url]);

  return (
    <>
      {loader && <Loader />}

      <div className="w-full min-h-screen pb-20 flex flex-col items-center">
        {/* ================= SEARCH PANEL ================= */}
        <div
          className={`fixed top-14 left-1/2 -translate-x-1/2 z-40 w-[95%] md:w-[80%] rounded-xl p-2 
          bg-[linear-gradient(310deg,rgba(9,15,13,1)_0%,rgba(1,1,1,1)_65%,rgba(0,163,0,1)_100%)]
          ${isSearch ? "flex" : "hidden"} flex-col gap-2`}
        >
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={searchVal}
              placeholder="Search here..."
              className="flex-1 bg-transparent border-b outline-none text-white p-1"
              onChange={(e) => setSearchVal(e.target.value)}
            />

            <button
              className="h-9 w-9 rounded-lg bg-red-500"
              onClick={handleSearch}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            <button
              className="text-white"
              onClick={() => setIsSearch(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="flex gap-2">
            {btns.map((btn) => (
              <button
                key={btn.id}
                className={`px-3 py-1 rounded-lg text-sm font-semibold
                  ${
                    selected === btn.id
                      ? "bg-red-500 text-white"
                      : "bg-white text-black"
                  }`}
                onClick={() => {
                  setSelected((p) => (p === btn.id ? null : btn.id));
                  setSortOpt((p) =>
                    p === btn.btnValue ? "latest" : btn.btnValue
                  );
                }}
              >
                {btn.lable}
              </button>
            ))}
          </div>
        </div>

        {/* ================= ADD NOTES ================= */}
        {isExpanded && (
          <div
            ref={sectionRef}
            className="fixed top-16 z-30 w-[95%] md:w-[70%] rounded-2xl
            bg-[linear-gradient(310deg,rgba(9,15,13,1)_0%,rgba(1,1,1,1)_65%,rgba(0,163,0,1)_100%)]"
          >
            <Addnotes
              getNotes={getNotes}
              isExpanded={isExpanded}
              note={noteToEdit}
              edit={edit}
              setEdit={setEdit}
              setIsExpanded={setIsExpanded}
            />
          </div>
        )}

        {/* ================= NOTES GRID ================= */}
        <div className="w-[95%] mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <div
                key={note._id}
                className="p-3 rounded-xl shadow-lg bg-black/40 flex justify-between"
              >
                <div className="w-[85%]">
                  <p className="font-bold">
                    {index + 1}. {note.title}
                  </p>
                  <p className="text-sm mt-1">{note.content}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    className="fa-solid fa-circle-xmark text-red-600"
                    onClick={() => deleteNote(note._id)}
                  />

                  <button
                    className={`${
                      note.isFav
                        ? "fa-solid fa-heart"
                        : "fa-regular fa-heart"
                    } text-red-600`}
                    onClick={() => handleFav(note._id)}
                  />

                  <button
                    className="fa-solid fa-pen text-blue-600"
                    disabled={edit}
                    onClick={() => {
                      setIsExpanded(true);
                      setEdit(true);
                      setNoteToEdit(note);
                      scroll();
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-red-500 text-xl">
              {msg}
            </div>
          )}
        </div>

        {/* ================= BOTTOM NAV ================= */}
        <div className="fixed bottom-0 left-0 w-full p-2 z-50">
          <div className="mx-auto max-w-md flex justify-between items-center p-2 rounded-2xl
          bg-[linear-gradient(310deg,rgba(9,15,13,1)_0%,rgba(1,1,1,1)_65%,rgba(0,163,0,1)_100%)]">

            <button onClick={handleSearch}>
              <i className="fa-solid fa-house"></i>
            </button>

            <button onClick={() => setIsSearch(true)}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            <button onClick={() => setUrl("http://localhost:3000/notes?fav=true")}>
              <i className="fa-solid fa-heart text-red-600"></i>
            </button>

            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
                setEdit(false);
                setIsSearch(false);
              }}
            >
              <i className={`fa-solid fa-${isExpanded ? "xmark" : "plus"}`}></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notes;
