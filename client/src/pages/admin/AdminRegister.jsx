import React from 'react'

const AdminRegister = () => {
  return (
    <div className='w-full h-screen overflow-y-hidden'>
        
            <h3 className='font-semibold text-3xl mb-6 mt-6'>ลงทะเบียนนักศึกษา</h3>
            
            <div className='flex justify-center items-center'>
                <form className='w-[50%] bg-white shadow-xl p-6 rounded-lg flex flex-col'>
                        <div className='mb-4 p-4 flex justify-around gap-2 items-center'>
                            <label className='font-semibold '>รหัสนักศึกษา</label>
                            <input className=' bg-gray-100 p-2 rounded-lg'/>
                        </div>

                        <div className='mb-4 p-4 flex justify-around gap-2 items-center'>
                            <label className='font-semibold '>รหัสผ่าน</label>
                            <input className=' bg-gray-100 p-2 rounded-lg'/>
                        </div>
                        
                        <div className='flex justify-center'>
                            
                            <button className='bg-[#05998A] w-60 p-3 rounded-xl text-white font-semibold transition-colors hover:bg-green-700'>เพิ่มรายชื่อ</button>

                        </div>
                </form>

            </div>


    </div>
  )
}

export default AdminRegister
