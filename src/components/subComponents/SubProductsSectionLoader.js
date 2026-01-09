import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import ProductLoader from "./productLoader";

const SubProductsSectionLoader = () => {
  return (
    <div className="mb-3 w-full md:px-10 px-3 py-4 md:py-10 flex flex-col gap-3 items-center justify-center">
      <h1 className="w-30 h-10 bg-zinc-200 rounded-lg animate-pulse px-3 text-zinc-600 "></h1>
      <p className="w-1/2 h-6 bg-zinc-200/50 rounded-l animate-pulse  px-3 text-zinc-600 "></p>

      {/* PC Grid */}
      <div className="hidden md:flex items-center justify-center  flex-wrap mt-2   gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductLoader key={index} />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="w-full my-3 md:hidden">
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <CarouselContent className="-ml-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem key={index} className="basis-[75%]">
                <ProductLoader />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default SubProductsSectionLoader;
