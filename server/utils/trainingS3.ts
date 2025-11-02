import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'liorian-training-data';

export interface TrainingProgress {
  userId: string;
  courseId: string;
  moduleId: string;
  slideNumber: number;
  timestamp: string;
  timeSpent: number;
  completed: boolean;
  quizScore?: number;
}

export interface QuizResult {
  userId: string;
  courseId: string;
  moduleId: string;
  quizId: string;
  score: number;
  answers: number[];
  timeSpent: number;
  timestamp: string;
  passed: boolean;
}

export interface TrainingReport {
  userId: string;
  userName: string;
  reportType: 'progress' | 'completion' | 'assessment';
  generatedAt: string;
  data: any;
}

// Store user progress in S3
export async function saveProgressToS3(progress: TrainingProgress): Promise<{ success: boolean; key?: string; error?: string }> {
  try {
    const key = `training-progress/${progress.userId}/${progress.courseId}/${progress.moduleId}/${Date.now()}.json`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(progress, null, 2),
      ContentType: 'application/json',
      Metadata: {
        userId: progress.userId,
        courseId: progress.courseId,
        moduleId: progress.moduleId,
        timestamp: progress.timestamp
      }
    });

    await s3Client.send(command);
    
    return { success: true, key };
  } catch (error) {
    console.error('Error saving progress to S3:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Store quiz results in S3
export async function saveQuizResultToS3(quizResult: QuizResult): Promise<{ success: boolean; key?: string; error?: string }> {
  try {
    const key = `quiz-results/${quizResult.userId}/${quizResult.courseId}/${quizResult.moduleId}/${Date.now()}.json`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(quizResult, null, 2),
      ContentType: 'application/json',
      Metadata: {
        userId: quizResult.userId,
        courseId: quizResult.courseId,
        moduleId: quizResult.moduleId,
        quizId: quizResult.quizId,
        score: quizResult.score.toString(),
        passed: quizResult.passed.toString(),
        timestamp: quizResult.timestamp
      }
    });

    await s3Client.send(command);
    
    return { success: true, key };
  } catch (error) {
    console.error('Error saving quiz result to S3:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Store training reports in S3
export async function saveReportToS3(report: TrainingReport): Promise<{ success: boolean; key?: string; error?: string }> {
  try {
    const key = `training-reports/${report.userId}/${report.reportType}/${Date.now()}.json`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(report, null, 2),
      ContentType: 'application/json',
      Metadata: {
        userId: report.userId,
        userName: report.userName,
        reportType: report.reportType,
        generatedAt: report.generatedAt
      }
    });

    await s3Client.send(command);
    
    return { success: true, key };
  } catch (error) {
    console.error('Error saving report to S3:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Retrieve user progress from S3
export async function getUserProgressFromS3(userId: string, courseId?: string): Promise<{ success: boolean; data?: TrainingProgress[]; error?: string }> {
  try {
    const prefix = courseId 
      ? `training-progress/${userId}/${courseId}/`
      : `training-progress/${userId}/`;

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix
    });

    const response = await s3Client.send(command);
    
    if (!response.Contents || response.Contents.length === 0) {
      return { success: true, data: [] };
    }

    // Fetch all progress files
    const progressData: TrainingProgress[] = [];
    
    for (const object of response.Contents) {
      if (object.Key) {
        try {
          const getCommand = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: object.Key
          });
          
          const objectResponse = await s3Client.send(getCommand);
          
          if (objectResponse.Body) {
            const content = await streamToString(objectResponse.Body);
            const progress: TrainingProgress = JSON.parse(content);
            progressData.push(progress);
          }
        } catch (error) {
          console.error(`Error reading progress file ${object.Key}:`, error);
          // Continue with other files
        }
      }
    }

    return { success: true, data: progressData };
  } catch (error) {
    console.error('Error retrieving progress from S3:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Retrieve quiz results from S3
export async function getQuizResultsFromS3(userId: string, courseId?: string): Promise<{ success: boolean; data?: QuizResult[]; error?: string }> {
  try {
    const prefix = courseId 
      ? `quiz-results/${userId}/${courseId}/`
      : `quiz-results/${userId}/`;

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix
    });

    const response = await s3Client.send(command);
    
    if (!response.Contents || response.Contents.length === 0) {
      return { success: true, data: [] };
    }

    // Fetch all quiz result files
    const quizData: QuizResult[] = [];
    
    for (const object of response.Contents) {
      if (object.Key) {
        try {
          const getCommand = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: object.Key
          });
          
          const objectResponse = await s3Client.send(getCommand);
          
          if (objectResponse.Body) {
            const content = await streamToString(objectResponse.Body);
            const quizResult: QuizResult = JSON.parse(content);
            quizData.push(quizResult);
          }
        } catch (error) {
          console.error(`Error reading quiz result file ${object.Key}:`, error);
          // Continue with other files
        }
      }
    }

    return { success: true, data: quizData };
  } catch (error) {
    console.error('Error retrieving quiz results from S3:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Get all users' training data (admin function)
export async function getAllUsersTrainingDataFromS3(): Promise<{ success: boolean; users?: string[]; error?: string }> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'training-progress/',
      Delimiter: '/'
    });

    const response = await s3Client.send(command);
    
    if (!response.CommonPrefixes) {
      return { success: true, users: [] };
    }

    // Extract user IDs from common prefixes
    const users = response.CommonPrefixes
      .map(prefix => prefix.Prefix?.replace('training-progress/', '').replace('/', ''))
      .filter(Boolean) as string[];

    return { success: true, users };
  } catch (error) {
    console.error('Error retrieving users list from S3:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Store PDF reports in S3
export async function savePDFReportToS3(pdfBuffer: Buffer, userId: string, reportType: string): Promise<{ success: boolean; key?: string; url?: string; error?: string }> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const key = `training-reports/pdf/${userId}/${reportType}-${timestamp}.pdf`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
      Metadata: {
        userId,
        reportType,
        generatedAt: new Date().toISOString()
      }
    });

    await s3Client.send(command);
    
    // Generate URL (you might want to use presigned URLs for security)
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
    
    return { success: true, key, url };
  } catch (error) {
    console.error('Error saving PDF report to S3:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Utility function to convert stream to string
async function streamToString(stream: any): Promise<string> {
  const chunks: Buffer[] = [];
  
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

// Health check for S3 connection
export async function testS3Connection(): Promise<{ success: boolean; error?: string }> {
  try {
    const testKey = `health-check/${Date.now()}.json`;
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'S3 connection test successful'
    };

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: testKey,
      Body: JSON.stringify(testData),
      ContentType: 'application/json'
    });

    await s3Client.send(command);
    
    return { success: true };
  } catch (error) {
    console.error('S3 connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Clean up old training data (optional maintenance function)
export async function cleanupOldTrainingData(daysOld: number = 90): Promise<{ success: boolean; deletedCount?: number; error?: string }> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'training-progress/'
    });

    const response = await s3Client.send(command);
    
    if (!response.Contents) {
      return { success: true, deletedCount: 0 };
    }

    let deletedCount = 0;

    // This is a simplified cleanup - in production you'd want to be more careful
    for (const object of response.Contents) {
      if (object.LastModified && object.LastModified < cutoffDate && object.Key) {
        // Delete old file (implement deletion logic here)
        console.log(`Would delete old training data: ${object.Key}`);
        deletedCount++;
      }
    }

    return { success: true, deletedCount };
  } catch (error) {
    console.error('Error during cleanup:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
