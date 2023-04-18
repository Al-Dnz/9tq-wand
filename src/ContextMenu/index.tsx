import React from 'react';
import { Dropdown } from 'antd';
import type { DropDownProps } from 'antd';
// @ts-ignore
import ellipsis from './ellipsis.svg';
import { css } from '@emotion/css';

export type ContextMenuProps = {
  className?: string;
  size?: 'small' | 'default' | number;
} & DropDownProps;

const buttonClassName = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  padding: 5px;
  transition: all 0.1s linear;
  &:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }
`;

const sizeToNumber = {
  default: '35',
  small: '25',
};

const ContextMenu: React.FC<ContextMenuProps> = (props) => {
  const { size = 'default', className = '', ...rest } = props;

  const sizeInPx =
    typeof size === 'number' ? `${size}px` : `${sizeToNumber[size] || sizeToNumber.default}px`;

  return (
    <Dropdown className={`${className} wand-dropdown-menu`} trigger={['click']} {...rest}>
      <span
        className={`${buttonClassName} ${css`
          height: ${sizeInPx};
          width: ${sizeInPx};
          border-radius: ${sizeInPx};
        `} wand-context-menu-handler`}
      >
        <img
          className={`
          ${css`
            width: 4px;
          `}
        `}
          src={ellipsis}
        />
      </span>
    </Dropdown>
  );
};

export default ContextMenu;
