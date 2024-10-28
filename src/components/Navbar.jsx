 "use client"

function Navbar() {
  return (
    <>
    <div className="h-[100vh] bg-zinc-900">
        <div className="h-[88px]  flex justify-around  items-center">
            <div className="">
                <h1 className="text-white text-3xl font-semibold">CodeX</h1>
            </div>
            <div className="flex gap-8 text-white list-none ">
                <li className="w-[27%]  h-[27px] bg-white text-black ">Dashboard</li>
                <li>PlayGround </li>
                <li>Login</li>
            </div>
        </div>
    </div>
    </>
  )
}

export default Navbar