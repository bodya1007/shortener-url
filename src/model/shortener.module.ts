import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/index';

export class ShortUrl extends Model {
  public id!: number;
  public shortcode!: string;
  public url!: string;
}

ShortUrl.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shortcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'shortener',
  }
);
