import _ from "lodash";
import * as grpc from "grpc";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { SurfaceCall } from "grpc/build/src/call";
import { APIServiceClient as Client } from "../protos/api/api_grpc_pb";
import {
  Trie,
  DataChunk,
  TrieRequest,
  CreateKeyValuesProofRequest,
  KeyValuesFilter,
  VerifyProofReply,
  Key,
  KeyValue,
  VerifyTrieProofRequest,
  VerifyProofReplyChunk,
  TrieKeyValueRequest,
  TrieKeyValuesRequest,
} from "../protos/api/api_pb";
import {
  createTrie,
  deleteTrie,
  importTrie,
  exportTrie,
  setTrieKeyValues,
  createKeyValuesProof,
  verifyTrieProof,
  verifyKeyValuesProof,
} from "./api";

declare module "../protos/api/api_pb" {
  namespace TrieRequest {
    function from(id: string): TrieRequest;
  }

  namespace TrieKeyValueRequest {
    function from(id: string, root: string, key: Key): TrieKeyValueRequest;
  }

  namespace TrieKeyValuesRequest {
    function from(id: string, root: string): TrieKeyValuesRequest;
  }

  namespace Key {
    function from(key: string, keyEncoding?: "utf8" | "hex"): Key;
  }

  namespace KeyValue {
    function from(
      key: string,
      val: string,
      keyEncoding?: "utf8" | "hex",
      valEncoding?: "utf8" | "hex"
    ): KeyValue;
  }

  interface KeyValue {
    to(
      keyEncoding?: "utf8" | "hex",
      valEncoding?: "utf8" | "hex"
    ): {
      key: string;
      val: string;
    };
  }
}

TrieRequest.from = (id) => {
  const tr = new TrieRequest();

  tr.setTrieId(id);

  return tr;
};

TrieKeyValueRequest.from = (id, root, key) => {
  const r = new TrieKeyValueRequest();

  r.setTrieId(id);
  r.setRoot(root);
  r.setKey(key);

  return r;
};

TrieKeyValuesRequest.from = (id, root) => {
  const r = new TrieKeyValuesRequest();

  r.setTrieId(id);
  r.setRoot(root);

  return r;
};

Key.from = (key: string, keyEncoding) => {
  const k = new Key();

  k.setKey(Buffer.from(key, keyEncoding ?? "utf8"));

  return k;
};

KeyValue.from = (key, val, keyEncoding, valEncoding) => {
  const kv = new KeyValue();

  kv.setKey(Buffer.from(key, keyEncoding ?? "utf8"));
  kv.setValue(Buffer.from(val, valEncoding ?? "utf8"));

  return kv;
};

KeyValue.prototype.to = function (keyEncoding, valEncoding) {
  return {
    key: Buffer.from(this.getKey_asU8()).toString(keyEncoding ?? "utf8"),
    val: Buffer.from(this.getValue_asU8()).toString(valEncoding ?? "utf8"),
  };
};

export class APIServiceClient extends Client {
  /**
   * Creates a new trie
   */
  createTrie(callback: grpc.requestCallback<Trie>): SurfaceCall;
  createTrie(
    argument: Empty,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  createTrie(
    argument: Empty,
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  createTrie(
    argument: Empty,
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  createTrie(arg1: any, arg2?: any, arg3?: any, arg4?: any): any {
    if (typeof arg1 === "function") {
      return createTrie(this, arg1);
    }

    return super.createTrie(arg1, arg2, arg3, arg4);
  }

  /**
   * Deletes the given trie
   */
  deleteTrie(id: string, callback: grpc.requestCallback<Trie>): SurfaceCall;
  deleteTrie(
    argument: TrieRequest,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  deleteTrie(
    argument: TrieRequest,
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  deleteTrie(
    argument: TrieRequest,
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  deleteTrie(arg1: any, arg2: any, arg3?: any, arg4?: any): any {
    if (typeof arg1 === "string") {
      return deleteTrie(this, arg1, arg2);
    }

    return super.deleteTrie(arg1, arg2, arg3, arg4);
  }

  /**
   * Imports the trie data and creates a new trie. If `id` is zero, a new trie ID will be generated,
   * which is recommended when importing
   */
  importTrie(
    id: string,
    path: string,
    callback: grpc.requestCallback<Trie>
  ): SurfaceCall;
  importTrie(
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientWritableStream<DataChunk>;
  importTrie(
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientWritableStream<DataChunk>;
  importTrie(
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientWritableStream<DataChunk>;
  importTrie(arg1: any, arg2?: any, arg3?: any): any {
    if (typeof arg1 === "string") {
      return importTrie(this, arg1, arg2, arg3);
    }

    return super.importTrie(arg1, arg2, arg3);
  }

  /**
   * Exports the given trie
   */
  exportTrie(
    id: string,
    outputPath: string,
    callback: grpc.requestCallback<undefined>
  ): SurfaceCall;
  exportTrie(
    argument: TrieRequest,
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientReadableStream<DataChunk>;
  exportTrie(
    argument: TrieRequest,
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientReadableStream<DataChunk>;
  exportTrie(arg1: any, arg2?: any, arg3?: any): any {
    if (typeof arg1 === "string") {
      return exportTrie(this, arg1, arg2, arg3);
    }

    return super.exportTrie(arg1, arg2, arg3);
  }

  setTrieKeyValues(
    id: string,
    root: string,
    iter: Iterable<KeyValue>,
    callback: grpc.requestCallback<Trie>
  ): SurfaceCall;
  setTrieKeyValues(
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientWritableStream<KeyValue>;
  setTrieKeyValues(
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientWritableStream<KeyValue>;
  setTrieKeyValues(
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientWritableStream<KeyValue>;
  setTrieKeyValues(arg1: any, arg2?: any, arg3?: any, arg4?: any): any {
    if (typeof arg1 === "string") {
      return setTrieKeyValues(this, arg1, arg2, arg3, arg4);
    }

    return super.setTrieKeyValues(arg1, arg2, arg3);
  }

  createKeyValuesProof(
    trieId: string,
    proofId: string,
    filter: KeyValuesFilter | null,
    outputPath: string,
    callback: grpc.requestCallback<undefined>
  ): SurfaceCall;
  createKeyValuesProof(
    argument: CreateKeyValuesProofRequest,
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientReadableStream<DataChunk>;
  createKeyValuesProof(
    argument: CreateKeyValuesProofRequest,
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientReadableStream<DataChunk>;
  createKeyValuesProof(
    arg1: any,
    arg2?: any,
    arg3?: any,
    arg4?: any,
    arg5?: any
  ): any {
    if (typeof arg1 === "string") {
      return createKeyValuesProof(this, arg1, arg2, arg3, arg4, arg5);
    }

    return super.createKeyValuesProof(arg1, arg2, arg3);
  }

  verifyTrieProof(
    trieId: string,
    proofId: string,
    callback: grpc.requestCallback<VerifyProofReply>,
    onKeyValue?: (kv: KeyValue) => void,
    dotGraphOutputPath?: string
  ): SurfaceCall;
  verifyTrieProof(
    argument: VerifyTrieProofRequest,
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientReadableStream<VerifyProofReplyChunk>;
  verifyTrieProof(
    argument: VerifyTrieProofRequest,
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientReadableStream<VerifyProofReplyChunk>;
  verifyTrieProof(
    arg1: any,
    arg2: any,
    arg3?: any,
    arg4?: any,
    arg5?: any
  ): any {
    if (typeof arg1 === "string") {
      return verifyTrieProof(this, arg1, arg2, arg3, arg4, arg5);
    }

    return super.verifyTrieProof(arg1, arg2, arg3);
  }

  verifyKeyValuesProof(
    path: string,
    callback: grpc.requestCallback<VerifyProofReply>,
    onKeyValue?: (kv: KeyValue) => void,
    dotGraphOutputPath?: string
  ): SurfaceCall;
  verifyKeyValuesProof(
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientDuplexStream<DataChunk, VerifyProofReplyChunk>;
  verifyKeyValuesProof(
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientDuplexStream<DataChunk, VerifyProofReplyChunk>;
  verifyKeyValuesProof(arg1: any, arg2?: any, arg3?: any, arg4?: any): any {
    if (typeof arg1 === "string") {
      return verifyKeyValuesProof(this, arg1, arg2, arg3, arg4);
    }

    return super.verifyKeyValuesProof(arg1, arg2);
  }
}

/**
 * Creates a new API Service client
 */
export function newApiServiceClient(
  hostPort: string,
  metadata: grpc.Metadata,
  secure = true
): APIServiceClient {
  const callCreds = grpc.credentials.createFromMetadataGenerator(
    (args: any, callback: any) => {
      callback(null, metadata);
    }
  );
  let creds: grpc.ChannelCredentials;

  if (secure) {
    creds = grpc.credentials.combineChannelCredentials(
      grpc.credentials.createSsl(),
      callCreds
    );
  } else {
    creds = grpc.credentials.createInsecure();
    // they don't have a public API to do this: https://github.com/grpc/grpc-node/issues/543
    (creds as any).callCredentials = callCreds;
  }

  return new APIServiceClient(hostPort, creds);
}
