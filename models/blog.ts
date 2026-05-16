import mongoose, { Schema, Document } from "mongoose";

// Content Block Schema
const ContentBlockSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["paragraph", "heading", "image", "quote", "list"],
      required: true,
    },
    content: {
      type: Schema.Types.Mixed, // Can be string or array of strings
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
  },
  { _id: true },
);

// Blog Schema
const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [300, "Subtitle cannot exceed 300 characters"],
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Booth Design",
        "Industry Trends",
        "Booth Strategy",
        "Marketing",
        "Sustainability",
        "Technology",
        "Event Management",
        "Other",
      ],
    },
    image: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    authorName: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    authorRole: {
      type: String,
      trim: true,
      default: "",
    },
    authorBio: {
      type: String,
      trim: true,
      default: "",
    },
    authorAvatar: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    content: {
      type: [ContentBlockSchema],
      required: [true, "Content is required"],
      validate: {
        validator: function (blocks: any[]) {
          return blocks && blocks.length > 0;
        },
        message: "At least one content block is required",
      },
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        userId: {
          type: String,
        },
        userName: {
          type: String,
          required: true,
        },
        userAvatar: {
          type: String,
        },
        content: {
          type: String,
          required: true,
        },
        likes: {
          type: Number,
          default: 0,
        },
        isAdmin: {
          type: Boolean,
          default: false,
        },
        replies: [
          {
            userId: String,
            userName: {
              type: String,
              required: true,
            },
            userAvatar: String,
            content: {
              type: String,
              required: true,
            },
            likes: {
              type: Number,
              default: 0,
            },
            isAdmin: {
              type: Boolean,
              default: false,
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
BlogSchema.index({ status: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ authorName: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ title: "text", subtitle: "text", tags: "text" }); // Full-text search

// Virtual for comment count (FIXED - with safety checks)
BlogSchema.virtual("commentCount").get(function () {
  const comments = this.comments || [];

  const countReplies = (replies: any[] = []): number => {
    return replies.reduce(
      (sum, reply) => sum + 1 + countReplies(reply.replies || []),
      0,
    );
  };

  return comments.length + countReplies(comments);
});

// Virtual for excerpt (first 150 characters of first paragraph)
BlogSchema.virtual("excerpt").get(function () {
  if (!this.content || this.content.length === 0) {
    return "";
  }

  // Find first paragraph block
  const firstParagraph = this.content.find(
    (block: any) => block.type === "paragraph",
  );

  if (firstParagraph && typeof firstParagraph.content === "string") {
    const text = firstParagraph.content;
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
  }

  return "";
});

// Virtual for formatted date
BlogSchema.virtual("formattedDate").get(function () {
  const date = this.publishedAt || this.createdAt;
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Export the model
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;

// Type for TypeScript
export interface IComment {
  userId?: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  isAdmin: boolean;
  replies: IReply[];
  createdAt: Date;
}

export interface IReply {
  userId?: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  isAdmin: boolean;
  createdAt: Date;
}

export interface IContentBlock {
  type: "paragraph" | "heading" | "image" | "quote" | "list";
  content: string | string[];
  caption?: string;
}

export interface IBlog extends Document {
  title: string;
  subtitle: string;
  category: string;
  image: {
    url: string;
    publicId: string;
  };
  authorName: string;
  authorRole: string;
  authorBio: string;
  authorAvatar: {
    url: string;
    publicId: string;
  };
  readTime: string;
  tags: string[];
  content: IContentBlock[];
  status: "draft" | "published" | "archived";
  slug: string;
  views: number;
  likes: number;
  comments: IComment[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  commentCount: number;
  excerpt: string;
  formattedDate: string;
}
