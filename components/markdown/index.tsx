// Export all markdown components from their individual files

export { Alert } from "@/components/ui/alert";
// Export UI components for convenience
export { Badge } from "@/components/ui/badge";
export { Button } from "@/components/ui/button";
export { Callout } from "./callout";
export { CardComponent as Card } from "./card";
export { CodeBlock } from "./code-block";
export { CopyButton } from "./copy-button";
export { H1, H2, H3, H4, H5, H6, Heading } from "./heading";
export { ImageComponent as Image } from "./image";
export { LinkComponent as Link } from "./link";

// Export existing components
export { PostCard } from "./post-card";
export { ReadingProgress } from "./reading-progress";
export { SeparatorComponent as Separator } from "./separator";
export { ShareButtons } from "./share-buttons";
export { TableOfContents } from "./table-of-contents";
export { Video } from "./video";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Import components for the main object
import { Callout } from "./callout";
import { CardComponent } from "./card";
import { CodeBlock } from "./code-block";
import { CopyButton } from "./copy-button";
import { H1, H2, H3, H4, H5, H6, Heading } from "./heading";
import { ImageComponent } from "./image";
import { LinkComponent } from "./link";
import { SeparatorComponent } from "./separator";
import { TableOfContents } from "./table-of-contents";
import { Video } from "./video";

// Main components object for Markdoc rendering
export const MarkdownComponents = {
  // Core components
  Image: ImageComponent,
  Link: LinkComponent,
  Card: CardComponent,
  CodeBlock,
  Callout,
  TableOfContents,
  Video,
  Separator: SeparatorComponent,

  // Components for Markdoc node rendering
  ImageComponent,
  LinkComponent,
  CardComponent,
  SeparatorComponent,
  Heading,

  // Typography enhancements
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,

  // Utility components
  CopyButton,
  Badge,
  Button,
  Alert,
};
