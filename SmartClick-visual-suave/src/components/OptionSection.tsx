'use client';
import { ReactNode } from 'react';
export function OptionSection({title,children,open=false}:{title:string;children:ReactNode;open?:boolean}){
 return <details className="sc-options" open={open}><summary>{title}<span aria-hidden="true" className="sc-options-chevron">⌄</span></summary><div className="sc-options-content">{children}</div></details>
}
