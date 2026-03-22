'use client';

import * as React from 'react';

import {
  CodeBlock as CodeBlockPrimitive,
  type CodeBlockProps as CodeBlockPropsPrimitive,
} from '@/components/animate-ui/primitives/animate/code-block';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/animate-ui/components/buttons/copy';
import { getStrictContext } from '@/lib/get-strict-context';

type CodeContextType = {
  code: string;
};

const [CodeProvider, useCode] =
  getStrictContext<CodeContextType>('CodeContext');

type CodeProps = React.ComponentProps<'div'> & {
  code: string;
};

function Code({ className, code, ...props }: CodeProps) {
  return (
    <CodeProvider value={{ code }}>
      <div className={cn('aui-code', className)} {...props} />
    </CodeProvider>
  );
}

type CodeHeaderProps = React.ComponentProps<'div'> & {
  icon?: React.ElementType;
  copyButton?: boolean;
};

function CodeHeader({
  className,
  children,
  icon: Icon,
  copyButton = false,
  ...props
}: CodeHeaderProps) {
  const { code } = useCode();

  return (
    <div className={cn('aui-code-header', className)} {...props}>
      {Icon && <Icon className="aui-code-header__icon" />}
      <span className="aui-code-header__title">{children}</span>
      {copyButton && (
        <CopyButton className="aui-code-header__copy" content={code} />
      )}
    </div>
  );
}

type CodeBlockProps = Omit<CodeBlockPropsPrimitive, 'code'> & {
  cursor?: boolean;
};

function CodeBlock({ cursor, className, ...props }: CodeBlockProps) {
  const { code } = useCode();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className={cn('aui-code-scroll', cursor && 'aui-code-scroll--cursor')}
    >
      <CodeBlockPrimitive
        code={code}
        theme="dark"
        className={cn('aui-code-block', className)}
        scrollContainerRef={scrollRef}
        {...props}
      />
    </div>
  );
}

export {
  Code,
  CodeHeader,
  CodeBlock,
  type CodeProps,
  type CodeHeaderProps,
  type CodeBlockProps,
};
