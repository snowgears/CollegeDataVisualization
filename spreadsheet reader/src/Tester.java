import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import java.io.File;
import java.io.FileWriter;
import java.util.HashMap;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class Tester {

    private static HashMap<String,Integer> blackArrests = new HashMap<String, Integer>();
    private static HashMap<String,Integer> whiteArrests = new HashMap<String, Integer>();

    public static void main(String[] args){

        File file = new File("/Users/Tanner/Desktop/Most-Recent-Cohorts-Scorecard-Elements.xlsx");
        if(file.exists()) {
            System.out.println("Found excel file. Reading...");
            readFromExcel(file);
        }
        else{
            System.out.println("Excel file not found.");
        }
    }

    private static void readFromExcel(File excelFile){
        try {
           // System.out.println("Got to point 1");

            Workbook wb = WorkbookFactory.create(excelFile); // Or foo.xlsx
            Sheet s = wb.getSheetAt(0);

            File fileDict = new File("/Users/Tanner/Desktop/CollegeScorecardDataDictionary.xlsx");
            Workbook wbDict = WorkbookFactory.create(fileDict); // Or foo.xlsx
            Sheet sDict = wbDict.getSheetAt(2);

//            System.out.println("Got to point 2");
//
//            if(s != null){
//                System.out.println("Sheet is not null");
//            }

            //SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");

            JSONObject mainObj = new JSONObject();
            mainObj.put("name", "flare");

            JSONArray mainChildren = new JSONArray();

            Row r;
            for(int i=1; i<=14000; i++) {
                r = s.getRow(i);
                if(r == null)
                    break;

                //Date date = r.getCell(1).getDateCellValue();
                //String sDate = format.format(date);
                String schoolName = r.getCell(3).getRichStringCellValue().toString();

                System.out.println("\nSchool Name: "+schoolName);

                if(isCASchool(schoolName)){
                    //System.out.println(schoolName);
                    //int medianEarnings = (int)r.getCell(20).getNumericCellValue();

                    try {

                        JSONObject obj = new JSONObject();
                        obj.put("name", schoolName);

                        String columnName;
                        double majorCount;
                        String majorName;
                        for(int j=46; j<73;j++){
                            System.out.println("j: "+j);
                            columnName = s.getRow(0).getCell(j).getRichStringCellValue().getString();

                            System.out.println("Column Name: "+columnName);

                            majorCount = r.getCell(j).getNumericCellValue();

                            majorName = getProgramTitle(sDict, columnName);

                            System.out.println("Major: "+majorName +", Percent: "+majorCount);

                            obj.put(majorName, majorCount);
                        }

                        schools.add(obj);

                    } catch (IllegalStateException e){
                        e.printStackTrace();
                    }
                }
                //}

                //System.out.println(""+i);
//                if(side.equalsIgnoreCase("arr")){
//                    System.out.println("Arrest data found.");
//                }
            }

            try{
                FileWriter file = new FileWriter("/Users/Tanner/Desktop/major_percentages.txt");
                file.write(schools.toJSONString());
                System.out.println("Successfully Copied JSON Object to File...");
                System.out.println("\nJSON Object: " + schools);
                file.close();
            }
            catch (Exception e1){
                e1.printStackTrace();
            }

        } catch(Exception ioe) {
            ioe.printStackTrace();
        }

//        //export to csv
//        for(Map.Entry<String,Integer> entry : whiteArrests.entrySet()){
//            System.out.println(entry.getKey()+","+entry.getValue());
//        }
    }

    private static void countValue(String date, HashMap<String, Integer> map){
        //System.out.println("Provided value: "+date);
        String value = date.substring(0, date.indexOf('/'));
        value = value + "/01/14";

        if(map.containsKey(value)){
            int temp = map.get(value);
            temp++;
            map.put(value, temp);
        }
        else{
            map.put(value, 1);
        }
    }

    private static boolean isCASchool(String schoolName){
        if(schoolName.contains("University of California-") && !schoolName.contains("Hastings") && !schoolName.contains("Merced"))
            return true;
        if(schoolName.contains("California State Polytechnic University") || schoolName.contains("California State University"))
            return true;
        return false;
    }

    private static String getProgramTitle(Sheet sDict, String title){
        Row r;
        for(int i=298; i<=14000; i++) {
            r = sDict.getRow(i);
            if (r == null)
                break;

            String programTitle = r.getCell(4).getRichStringCellValue().toString();

            if(programTitle.equals(title)){
                System.out.println("Title: "+programTitle);
                return r.getCell(2).getRichStringCellValue().toString();
            }
        }
        return "";
    }
}
