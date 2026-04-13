import { Link as ChakraLink } from "@chakra-ui/react";
import { createLink, type CreateLinkProps } from "@tanstack/react-router";
import { forwardRef, type ComponentProps } from "react";

export const RouterLink = createLink(
  forwardRef<
    HTMLAnchorElement,
    CreateLinkProps & ComponentProps<typeof ChakraLink>
  >((props, ref) => <ChakraLink ref={ref} {...props} />),
);
