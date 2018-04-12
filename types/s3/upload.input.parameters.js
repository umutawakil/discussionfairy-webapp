
function S3UploadInputParameters(){
  this.object = {}
  this.key  = "SOME_KEY"
  this.type = "SOME_TYPE"
  this.accessKey = "SOME_ACCESS_KEY",
  this.secretKey = "SOME_SECRET_KEY",
  this.recordingSourceBucket = "SOME_RECORDING_SOURCE_BUCKET",
  this.recordingSourceURL = "SOME_RECORDING_SOURCE_URL",
  this.recordingUploadURL = "SOME_RECORDING_Upload_URL",
  this.s3VerificationSecret = "SOME_S3_Verificaton_Secret",
  this.domainName = "SOME_DOMAIN_NAME"
}

module.exports = S3UploadInputParameters
