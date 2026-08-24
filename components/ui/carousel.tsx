"use client";

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as stylex from "@stylexjs/stylex";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { mergeSx } from "@/lib/stylex/sx";
import { radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    position: "relative",
  },
  viewport: {
    overflow: "hidden",
  },
  content: {
    display: "flex",
  },
  contentHorizontal: {
    marginLeft: "-1rem",
  },
  contentVertical: {
    marginTop: "-1rem",
    flexDirection: "column",
  },
  item: {
    minWidth: 0,
    flexShrink: 0,
    flexGrow: 0,
    flexBasis: "100%",
  },
  itemHorizontal: {
    paddingLeft: "1rem",
  },
  itemVertical: {
    paddingTop: "1rem",
  },
  previous: {
    position: "absolute",
    width: "2rem",
    height: "2rem",
    borderRadius: radii.full,
  },
  previousHorizontal: {
    left: "-3rem",
    top: "50%",
    transform: "translateY(-50%)",
  },
  previousVertical: {
    top: "-3rem",
    left: "50%",
    transform: "translateX(-50%) rotate(90deg)",
  },
  next: {
    position: "absolute",
    width: "2rem",
    height: "2rem",
    borderRadius: radii.full,
  },
  nextHorizontal: {
    right: "-3rem",
    top: "50%",
    transform: "translateY(-50%)",
  },
  nextVertical: {
    bottom: "-3rem",
    left: "50%",
    transform: "translateX(-50%) rotate(90deg)",
  },
});

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api2: CarouselApi) => {
    if (!api2) {
      return;
    }
    setCanScrollPrev(api2.canScrollPrev());
    setCanScrollNext(api2.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!(api && setApi)) {
      return;
    }
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <section
        aria-roledescription="carousel"
        data-slot="carousel"
        onKeyDownCapture={handleKeyDown}
        // biome-ignore lint/a11y/useSemanticElements: shadcn convention
        role="region"
        {...mergeSx(stylex.props(styles.root), className, style)}
        {...props}
      >
        {children}
      </section>
    </CarouselContext.Provider>
  );
}

function CarouselContent({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      data-slot="carousel-content"
      ref={carouselRef}
      {...stylex.props(styles.viewport)}
    >
      <div
        {...mergeSx(
          stylex.props(
            styles.content,
            orientation === "horizontal"
              ? styles.contentHorizontal
              : styles.contentVertical,
          ),
          className,
          style,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    <div
      aria-roledescription="slide"
      data-slot="carousel-item"
      role="group"
      {...mergeSx(
        stylex.props(
          styles.item,
          orientation === "horizontal"
            ? styles.itemHorizontal
            : styles.itemVertical,
        ),
        className,
        style,
      )}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  style,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      size={size}
      variant={variant}
      {...mergeSx(
        stylex.props(
          styles.previous,
          orientation === "horizontal"
            ? styles.previousHorizontal
            : styles.previousVertical,
        ),
        className,
        style,
      )}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  style,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      disabled={!canScrollNext}
      onClick={scrollNext}
      size={size}
      variant={variant}
      {...mergeSx(
        stylex.props(
          styles.next,
          orientation === "horizontal"
            ? styles.nextHorizontal
            : styles.nextVertical,
        ),
        className,
        style,
      )}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
