 "use client"

function Navbar() {
  return (
    <>
    <div className="h-[100vh] bg-zinc-900">
        <div className="h-[88px]  flex justify-around  items-center">
            <div className="">
                <h1 className="text-white text-3xl font-semibold">CodeX</h1>
            </div>
            <div className="flex gap-8 text-white list-none rounded-md">
                <div className="bg-white text-black p-2">
                    
                <li className="">Dashboard</li>
                </div>
                <div className="flex gap-8 text-white list-none rounded-md ">
                <div className="bg-white text-black p-2">
                    
                <li className="">Dashboard</li>
                </div>
                </div> 
                <div className="flex gap-8 text-white list-none rounded-md ">
                <div className=" transition-all hover:bg-black hover:text-black">
                    
                <li className="">Dashboard</li>
                </div>
                </div>    
            </div>

        </div>
    </div>
    </>
  )
}

export default Navbar