import "./ui.css";

const getPublisherName = (item = {}) => {
  const uploadedBy = item.uploadedBy || item.uploadedby;

  if (typeof uploadedBy === "object" && uploadedBy !== null) {
    return uploadedBy.name || uploadedBy.email || "";
  }

  return item.publisherName || item.authorName || "";
};

export default function ResourcePublisher({ item }) {
  const publisher = getPublisherName(item);

  if (!publisher) return null;

  return <p className="resource-publisher">By {publisher}</p>;
}
