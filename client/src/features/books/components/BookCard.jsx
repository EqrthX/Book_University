import { Link } from 'react-router-dom'

function BookCard({ book }) {
  return (
    <Link to={`/user/DetailsPage/${book.id}`} className="flex justify-center">
      <div className="w-72 bg-white hover:bg-gray-200 border border-gray-100 rounded-lg shadow overflow-hidden">
        <div className="flex justify-center items-center py-4">
          <img
            className="w-2/4 h-auto"
            src={`http://localhost:5001/${book.bookPic}`}
            alt="book"
          />
        </div>
        <div className="p-5">
          <h2 className="mb-2 text-lg font-bold text-gray-900 truncate">
            {book.titleBook}
          </h2>
          <h5 className="mb-2 text-l font-bold text-gray-900">
            รายละเอียด : {book.description}
          </h5>
          <p className="mb-3 font-bold text-xl text-gray-700">{book.price} ฿</p>
        </div>
      </div>
    </Link>
  )
}

export default BookCard
