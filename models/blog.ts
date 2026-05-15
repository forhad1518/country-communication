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
      type: String,
      required: [true, "Featured image is required"],
      trim: true,
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
      type: String,
      trim: true,
      default: "",
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
BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ authorName: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ title: "text", subtitle: "text", tags: "text" }); // Full-text search

// Virtual for comment count
BlogSchema.virtual("commentCount").get(function () {
  const countReplies = (replies: any[]): number => {
    return replies.reduce(
      (sum, reply) => sum + 1 + countReplies(reply.replies || []),
      0,
    );
  };
  return this.comments.length + countReplies(this.comments);
});

// Virtual for excerpt (first 150 characters of first paragraph)
BlogSchema.virtual("excerpt").get(function () {
  const firstParagraph = this.content.find(
    (block: any) => block.type === "paragraph",
  );
  if (firstParagraph && typeof firstParagraph.content === "string") {
    return (
      firstParagraph.content.substring(0, 150) +
      (firstParagraph.content.length > 150 ? "..." : "")
    );
  }
  return "";
});

// Pre-save middleware to auto-generate slug if empty
BlogSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 100);
  }

  // Set publishedAt when status changes to published
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }

  next();
});

// Pre-save middleware to calculate read time if not provided
BlogSchema.pre("save", function (next) {
  if (!this.readTime || this.readTime === "5 min read") {
    let wordCount = 0;
    this.content.forEach((block: any) => {
      if (typeof block.content === "string") {
        wordCount += block.content.split(/\s+/).length;
      } else if (Array.isArray(block.content)) {
        block.content.forEach((item: string) => {
          wordCount += item.split(/\s+/).length;
        });
      }
    });
    const minutes = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
    this.readTime = `${minutes} min read`;
  }
  next();
});

// Export the model
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;

// Type for TypeScript
export interface IBlog extends Document {
  title: string;
  subtitle: string;
  category: string;
  image: string;
  authorName: string;
  authorRole: string;
  authorBio: string;
  authorAvatar: string;
  readTime: string;
  tags: string[];
  content: {
    type: "paragraph" | "heading" | "image" | "quote" | "list";
    content: string | string[];
    caption?: string;
  }[];
  status: "draft" | "published" | "archived";
  slug: string;
  views: number;
  likes: number;
  comments: {
    userId?: string;
    userName: string;
    userAvatar?: string;
    content: string;
    likes: number;
    isAdmin: boolean;
    replies: {
      userId?: string;
      userName: string;
      userAvatar?: string;
      content: string;
      likes: number;
      isAdmin: boolean;
      createdAt: Date;
    }[];
    createdAt: Date;
  }[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  commentCount: number;
  excerpt: string;
}
