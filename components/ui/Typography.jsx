import * as React from "react";

const Paragraph = React.forwardRef(({ className = "", ...props }, ref) => (
  <p ref={ref} className={"leading-7 text-base " + className} {...props} />
));
Paragraph.displayName = "Paragraph";

const Muted = React.forwardRef(({ className = "", ...props }, ref) => (
  <p ref={ref} className={"text-sm text-muted-foreground " + className} {...props} />
));
Muted.displayName = "Muted";

export { Paragraph, Muted };
