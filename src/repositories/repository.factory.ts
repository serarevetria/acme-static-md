import { PageRepository } from "./page.repository";
import { LocalFileRepository } from "./local-file.repository";

export class RepositoryFactory {
  static createPageRepository(): PageRepository {
    // If we are willing to store markdown files using a storage service (e.g. S3),
    // we would just change the implementation returned here without impacting the service or controller layers.
    return new LocalFileRepository();
  }
}
