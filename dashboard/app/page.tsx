import Link from "next/link";

const MainPage = () => {
  return (
    <div className="container max-w-5xl h-screen mx-auto py-24">
      <h1 className="text-5xl font-bold tracking-tight">
        <span className="font-semibold">DKSH</span> LLE
      </h1>

      <p className="text-2xl mt-2">
        Go 언어 기반 <span className="font-bold">Linux 실습 환경</span> 자동
        구축 시스템
      </p>

      <p className="text-lg mt-4 text-gray-11">
        DKSH LLE (Linux Learning Environment)는 Go 언어 기반의 Linux 실습 환경
        자동 구축 시스템입니다.
      </p>

      <div className="flex items-center gap-8 py-8">
        <img
          className="h-12"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Go_Logo_Blue.svg/1200px-Go_Logo_Blue.svg.png"
        />

        <img src="/01-primary-blue-docker-logo.png" className="h-12" />
      </div>

      <Link
        href="/dashboard"
        className="contact-container relative font-semibold block text-4xl mt-8 rounded-full max-w-fit  px-16 py-4 group border-2 overflow-hidden"
      >
        <div className="ripple bg-black rounded-t-[50%] group-hover:rounded-none w-full h-full translate-y-[101%] absolute delay-[50ms] inset-0 transition-all duration-300 group-hover:-translate-y-0"></div>
        <div className="contact-us inline-block after:inline-block relative group-hover:translate-y-[-130%] transition duration-300 after:[content:'대시보드_→'] after:text-white after:absolute after:top-[130%] after:left-0 ">
          대시보드 &rarr;
        </div>
      </Link>
    </div>
  );
};

export default MainPage;
