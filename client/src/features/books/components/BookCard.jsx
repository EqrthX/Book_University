import { Link } from 'react-router-dom';
import { SERVER_URL } from '../../../util/axios.js';

function BookCard({ book }) {
  const imageUrl = book.bookPic
    ? `${SERVER_URL}/${book.bookPic.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/150";

  return (
    <Link to={`/user/DetailsPage/${book.id}`} className="block h-full group">
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
        {/* Book Cover Image container */}
        <div className="relative aspect-[3/4] bg-slate-50 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100">
          <img
            className="h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out shadow-md"
            src={imageUrl}
            alt={book.titleBook || "book"}
          />
        </div>

        {/* Book details */}
        <div className="p-4 flex flex-col flex-grow justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {book.titleBook}
            </h3>
            {book.description && (
              <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {book.description}
              </p>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
            <span className="text-lg font-black text-blue-600">{book.price} ฿</span>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
              {book.status === 'available' ? 'พร้อมส่ง' : book.status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
