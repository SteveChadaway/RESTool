import React from 'react';

import { IConfigDisplayField, IConfigCustomAction } from '../../common/models/config.model';
import { dataHelpers } from '../../helpers/data.helpers';
import { Button } from '../button/button.comp';

import './table.scss';

interface IProps {
  items: any[]
  callbacks: {
    delete: ((item: any) => void) | null
    put: ((item: any) => void) | null
    action: (item: any, action: IConfigCustomAction) => void
  }
  fields: IConfigDisplayField[]
  customActions?: IConfigCustomAction[]
}

export const Table = ({ items, fields, callbacks, customActions }: IProps) => {
  function renderTableCell(origField: IConfigDisplayField, value: any) {
    if (value && typeof value === 'object') {
      return 'object';
    }

    switch (origField.type) {
      case 'text':
        return <span>{value}</span>;
      case 'boolean':
        return <div className={`bool ${value ? 'true' : 'false'}`}></div>;
      case 'image':
        return <img src={value || ''} alt={value || origField.label || origField.name} />;
      case 'url':
        const url: string = (origField.url || value || '').replace(`:${origField.name}`, value);
        return <a href={url} target="_blank" rel="noopener noreferrer">{value}</a>;
      case 'colorbox':
        return <div className="colorbox" style={{ backgroundColor: value }}></div>;
      default:
        return value;
    }
  }

  return (
    <div className="table-wrapper">
      <table className="pure-table">
        <thead>
          <tr>
            {
              fields.map((field) => {
                return <th key={`th_${field.name}`}>{field.label || field.name}</th>;
              })
            }
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((item, rowIdx) => {
              return (
                <tr key={`tr_${rowIdx}`}>
                  {
                    fields.map((field, fieldIdx) => {
                      const value = dataHelpers.extractDataByDataPath(item, field.dataPath, field.name);
                      return <td key={`td_${rowIdx}_${fieldIdx}`}>{renderTableCell(field, value)}</td>
                    })
                  }
                  <td>
                    <div className="actions-wrapper">
                      {
                        callbacks.put &&
                        <Button onClick={() => callbacks.put?.(item)} title="Edit">
                          <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </Button>
                      }
                      {
                        (customActions && customActions.length > 0) &&
                        customActions.map((action, idx) => (
                          <Button key={`action_${rowIdx}_${idx}`} onClick={() => callbacks.action(item, action)} title={action.name}>
                            <i className={`fa fa-${action.icon || 'cogs'}`} aria-hidden="true"></i>
                          </Button>
                        ))
                      }
                      {
                        callbacks.delete &&
                        <Button onClick={() => callbacks.delete?.(item)} title="Delete">
                          <i className="fa fa-times" aria-hidden="true"></i>
                        </Button>
                      }
                    </div>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
}