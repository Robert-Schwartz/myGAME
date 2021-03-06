const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {
    static like(body, models) {
        return models.Like.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'title',
                    'created_at',
                    'content',
                    sequelize.literal('(SELECT COUNT(*) FROM Like WHERE post.id = Like.post_id)'), 'like_count'
                ]
            });
        });
    }
    
};

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        createdAt: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);


module.exports = Post;